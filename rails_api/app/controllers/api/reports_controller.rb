# app/controllers/api/reports_controller.rb
module Api
    class ReportsController < ApplicationController
  
      # POST /api/generate-report
      def create
        categorized = params[:categorizedSuggestions]
        total = params[:totalMessages]
        duration = params.dig(:simulationData, :duration)
  
        prompt = <<~PROMPT
          You are an incident summary assistant. You will receive a JSON object with categorized suggestions, total messages exchanged, and incident duration.
  
          Your task is to produce a structured incident summary that includes:
  
          1. A short overview of the incident.
          2. A bullet list of all Action Items.
          3. A timeline of key events.
          4. Root cause hypotheses.
          5. Affected systems or metadata.
          6. Post-incident follow-ups (tasks to be completed after the incident is resolved).
  
          Respond in markdown format.

          Make sure to list out the most important information in a list of bullet points. Include the top 5 per category
  
          Incident Details:
          #{JSON.pretty_generate({
            suggestions: categorized,
            totalMessages: total,
            duration: duration
          })}
        PROMPT
  
        client = OpenAI::Client.new(access_token: ENV["OPENAI_API_KEY"])
        response = client.chat(
          parameters: {
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a technical incident summarizer." },
              { role: "user", content: prompt }
            ],
            temperature: 0.3
          }
        )
  
        summary = response.dig("choices", 0, "message", "content")
        render json: { summary: summary }, status: :ok
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
  