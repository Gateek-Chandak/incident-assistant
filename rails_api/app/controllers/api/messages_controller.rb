module Api
    class MessagesController < ApplicationController
        def create
            message = TranscriptLine.create!(message_params)
            render json: message, status: :created
        end

        def suggestions
            message = TranscriptLine.find(params[:id])
            client = OpenAI::Client.new
          
            prompt = <<~PROMPT
              Here's a message from a live incident transcript:
          
              "#{message.text}"
          
              If there's a useful suggestion — like an action item, timeline event, or root cause — summarize it in plain English. If not, say "No suggestion".
            PROMPT
          
            response = OpenAIClient.chat(
                parameters: {
                    model: "gpt-4o-mini",
                    messages: [
                    { role: "system", content: "You are an incident response assistant." },
                    { role: "user", content: prompt }
                    ],
                    temperature: 0.2
                }
            )
          
            suggestion = response.dig("choices", 0, "message", "content")
            render json: { suggestion: suggestion }
        end          

        private

        def message_params
            params.require(:message).permit(:speaker, :text, :order)
        end
    end
end  
