class CreateTranscriptLines < ActiveRecord::Migration[8.0]
  def change
    create_table :transcript_lines do |t|
      t.string :speaker
      t.text :text
      t.integer :order

      t.timestamps
    end
  end
end
