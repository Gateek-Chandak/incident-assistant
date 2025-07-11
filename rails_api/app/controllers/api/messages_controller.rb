# app/controllers/api/messages_controller.rb
module Api
    class MessagesController < ApplicationController
  
      # POST /api/messages
      def create
        user_id = request.remote_ip # crude session separation; works for take-home
        speaker = params[:message][:speaker]
        user_text = params[:message][:text]
  
        # Get current context
        chat_context = get_context(user_id)
  
        # Add initial system instruction once
        if chat_context.none? { |msg| msg[:role] == "system" }
          chat_context.unshift({
            role: "system",
            content: <<~PROMPT.strip
              You are a specialized AI assistant trained to support real-time incident responders. 
              Your goal is to analyze the following user message and determine whether it contains any 
              information that requires follow-up, timeline recording, root cause exploration, or metadata tagging 
              and return a JSON response in this format:

              {
                "category": "Action_Item" | "Timeline_Event" | "Root_Cause_Signal" | "Metadata_Hint" | "Follow_Up" | "None",
                "suggestion": "Short plain-English suggestion, or 'No Suggestion' if nothing applies"
              }

              Only respond with valid JSON — no preamble, no explanations.

              Follow this structured process:

              1. Read the message and identify if it fits any or multiple of the categories below.
              2. If it fits, summarize the insight in plain English as a clear suggestion.
              3. If it does not fit any category, respond exactly with: "No Suggestion"

              Classify the message into exactly one of the following categories:

              - "Action_Item": If the message suggests an action to take **during the incident**, to mitigate or resolve it.
              - "Follow_Up": If the message refers to something that should be done **after the incident is resolved** (e.g. retrospectives, alerts review, documentation).
              - "Timeline_Event": If the message announces a change in status (e.g. resolution, escalation, mitigation).
              - "Root_Cause_Signal": If the message proposes a reason for the incident or hypothesis about what triggered it.
              - "Metadata_Hint": If the message adds detail about scope, affected systems, locations, or severity.
              - "None": If none of the above apply.

              Use this logic:

              1. If it is post-incident cleanup  Ex. "Let's check in with Matt after this" → `Follow_Up`
              2. If it is resolving the incident → `Action_Item`
              3. If it is a status change or any informational update for the incident → `Timeline_Event`
              4. If it is a hypothesis or potential cause → `Root_Cause_Signal`
              5. If it adds metadata or scope → `Metadata_Hint`
              6. Otherwise → `None`

              Output a single line suggestion. Do not include analysis, or reasoning.
              If the message is related to the client/user, indicate that in natural language.
              If the message is not related to the client/user, indicate who or what it is related to in natural language.

              Message:
              "#{user_text}"
            PROMPT
          })
        end
  
        # Add user message to context
        chat_context << { role: "user", content: user_text }

        puts "=== Current OpenAI Chat Context ==="
        pp chat_context
        puts "==================================="

  
        # Call OpenAI
        client = OpenAI::Client.new(access_token: ENV["OPENAI_API_KEY"])
        response = client.chat(
          parameters: {
            model: "gpt-4o-mini",
            messages: chat_context,
            temperature: 0.2
          }
        )

        parsed = JSON.parse(response.dig("choices", 0, "message", "content")) rescue nil

        # Save assistant reply to context
        chat_context << { role: "assistant", content: response.dig("choices", 0, "message", "content") }

        # Store back limited context
        store_context(user_id, chat_context)

        render json: {
          speaker: speaker,
          text: user_text,
          suggestion: parsed&.dig("suggestion") || "No Suggestion",
          type: parsed&.dig("category") || "None"
        }, status: :ok
      end
  
      private
  
      def get_context(user_id)
        Rails.cache.fetch("chat_context_#{user_id}") { [] }
      end
  
      def store_context(user_id, context)
        trimmed = context.last(30) # prevent memory bloat
        Rails.cache.write("chat_context_#{user_id}", trimmed)
      end
    end
  end
  