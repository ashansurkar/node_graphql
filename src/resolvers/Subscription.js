const Subscription = {
    comment:{
        subscribe(parent,{ postid },{ db, pubsub },info){
            const post = db.posts.find( post => post.id === postid && post.published);
            if(!post){
                throw new Error ( 'No post found')
            }
            return pubsub.asyncIterator(`comment - ${postid}`)
        }
    },
    post: {
        subscribe(parent,args,{ db, pubsub },info){
            return pubsub.asyncIterator(`post`)
        }
    }
}
export { Subscription as default }