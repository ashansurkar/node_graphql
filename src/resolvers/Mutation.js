import { v4 as uuidv4 } from 'uuid';
const Mutation = {
    createUser(parent,args,{ db },info){
        const emailTaken = db.users.some( user=> user.email === args.data.email );
        if(emailTaken){
            throw new Error('Email has been taken');
        }
        const user = {
            id : uuidv4(),
            ...args.data
        }
        db.users.push(user);
        return user
    },
    updateUser(parent,args,{ db },info){
        const { id, data } = args
        const user = db.users.find( user=> user.id === id );
        
        if(!user){
            throw new Error('User not found');
        }
        if(typeof data.email ===  'string'){
            const emailTaken = db.users.some( user=> user.email === data.email );
            if(emailTaken){
                throw new Error('Email has been taken');
            }
            user.email = data.email
        }
        if(typeof data.name ===  'string'){ 
            user.name = data.name
        }
        if( typeof data.age !== 'undefined' ){
            user.age = data.age
        }
        return user
    },
    deleteUser(parent,args,{ db },info){
        const userIndex = db.users.findIndex( user=> user.id === args.id );
        if(userIndex === -1){
            throw new Error('User not found');
        }
        const deletedUser = db.users.splice(userIndex, 1);
        db.posts = db.posts.filter(post=>{
            const isMatch = post.author === args.id;
            if(isMatch){
                db.comments = db.comments.filter( comm=> comm.post !== post.id )
            }
            return !isMatch
        });
        db.comments = db.comments.filter( comm=> comm.author !== args.id )

        return deletedUser[0]

    },
    createPost(parent,args,{ db, pubsub },info){
        const user = db.users.some( user=> user.id === args.data.author );
        if(!user){
            throw new Error('Author not found')
        }
        const post = {
            id : uuidv4(),
            ...args.data
        }
        db.posts.push(post);
        if(args.data.published){
            pubsub.publish('post', {
                post :{
                    mutation : "CREATED",
                    data : post
                }
            })
        }
        return post;
    },
    updatePost(parent,args,{ db, pubsub },info){
        const { id, data } = args
        const post = db.posts.find( post=> post.id === id )
        const originalpost = {...post}
        if(!post){
            throw new Error('Post not found');
        }
        if( typeof data.title === 'string'){
            post.title = data.title
        }
        if( typeof data.body === 'string'){
            post.body = data.body
        }
        if( typeof data.published === 'boolean'){
            post.published = data.published
        
            if(originalpost.published && !post.published){
                pubsub.publish('post', {
                    post :{
                        mutation : "DELETED",
                        data : originalpost
                    }
                })
            }
            else if(!originalpost.published && post.published){
                pubsub.publish('post', {
                    post :{
                        mutation : "CREATED",
                        data : post
                    }
                })
            }
        }
        else if(post.published){
            pubsub.publish('post', {
                post :{
                    mutation : "UPDATED",
                    data : post
                }
            })
        }
        return post
    },
    deletePost(parent,args,{ db, pubsub },info){
        const postIndex = db.posts.findIndex( post=> post.id === args.id );
        if(postIndex === -1){
            throw new Error('Post not found');
        }
        const [post] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter( comm=> comm.post !== args.id )
        if(post.published){
            pubsub.publish('post', {
                post :{
                    mutation : "DELETED",
                    data : post
                }
            })
        }
        return post
    },
    createComment(parent,args,{ db, pubsub },info){
        const user = db.users.some( user=> user.id === args.data.author );
        const post = db.posts.some( post=> post.id === args.data.post && post.published);
        if(!user){
            throw new Error('Author not found')
        }
        if(!post){
            throw new Error('Post not found')
        }
        const comment = {
            id : uuidv4(),
            ...args.data
        };
        db.comments.push(comment);
        pubsub.publish(`comment - ${args.data.post}`, {
            comment :{
                mutation : "CREATED",
                data : comment
            }
        })
        return comment;
    },
    updateComment(parent,args,{ db, pubsub },info){
        const { id , data } = args;
        const comm = db.comments.find( comment => comment.id === id );
        if(!comm){
            throw new Error("Comment not found");
        }
        if(typeof data.text === 'string'){
            comm.text = data.text;
        }
        pubsub.publish(`comment - ${comm.post}`, {
            comment :{
                mutation : "UPDATED",
                data : comm
            }
        })
        return comm
    },
    deleteComment(parent,args,{ db, pubsub },info){
        const commIndex = db.comments.findIndex( comm=> comm.id === args.id );
        if(commIndex === -1){
            throw new Error('Comment not found');
        }
        const [comment] = db.comments.splice(commIndex, 1);
        pubsub.publish(`comment - ${comment.post}`, {
            comment :{
                mutation : "DELETED",
                data : comment
            }
        })
        return comment
    },
}
export { Mutation as default }