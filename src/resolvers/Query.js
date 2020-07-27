const Query ={
       
    me(){
        return {
            id : '7896',
            name:'Ashish',
            email:'ashish@test.com'
        }
    },
    posts(parent,args,{ db },info){
        if(!args.query){
            return db.posts
        }

    },
    comments(parent,args,{ db },info){
        if(!args.query){
            return db.comments
        }
    },
    users(parent,args,{ db },info){
        if(!args.query){
        return db.users
        }
        return db.users.filter(user=> user.name.toLowerCase().includes(args.query.toLowerCase()))
    }
}

export  { Query as default }