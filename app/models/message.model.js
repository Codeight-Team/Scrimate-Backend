module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            conversation_id: {
                type: String
            },
            sender: {
                type: String
            },
            text: {
                type: String
            }
        },
        {timestamps: true}
    );
    const Message = mongoose.model("message", schema);
    return Message;
}