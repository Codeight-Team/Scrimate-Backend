module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            match_id: {
                type: String
            },
            members: {
                type: Array
            }, 
        },
        {timestamps: true}
    );
    const Conversation = mongoose.model("conversation", schema);
    return Conversation;
}