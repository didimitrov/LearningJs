var Post = (function () {
  function Post(id, title, content, author, dateCreated, viewsCount, voteCount, commentsCount, comments, img, tags){
      this.id = id,
      this.title = title,
      this.content = content,
      this.author = author,
      this.createdAt = dateCreated,
      this.viewsCount = viewsCount,
      this.voteCount = voteCount,
      this.commentsCount = commentsCount,
      this.img = img,
      this.tags = tags
      if  (!comments){
        this.comments = [];
        this.commentsCount = 0;
      }else{
        this.comments = comments;
        this.commentsCount = comments.length;
      }

  }
  
  Post.prototype.addComment = function (comment) {
    this.comments.push(comment)
  };

  return Post;
}());