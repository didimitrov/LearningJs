var Comment = (function () {
    function Comment(id, content, author, dateCreated, commentNumber) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.dateCreated = dateCreated;
        this.commentNumber = commentNumber;
    }

    return Comment;
}());