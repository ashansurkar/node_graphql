import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

const users = [{
    id : '1',
    name:'Ashish',
    email:'ashish@test.com'
},
{
    id : '2',
    name:'Utsav',
    email:'Utsav@test.com',
    age : 30
},
{
    id : '3',
    name:'Jerusha',
    email:'jerusha@test.com',
    age : 30
}];

const posts = [{
    id:'1',
    title : 'graphql getting started',
    body : 'getting started with node and graphql is easy',
    published : true,
    author : '2'
},
{
    id:'2',
    title : 'Js learning',
    body : 'Javascript is amazing',
    published : false,
    author : '2'
},
{
    id:'3',
    title : 'node learning',
    body : 'node is amazing',
    published : false,
    author : '3'
}]

const comments = [{
    id : '1',
    text : 'comment for node',
    author: '1',
    post : '3'
},
{
    id : '2',
    text : 'comment 2 for node',
    author: '2',
    post : '3'
},
{
    id : '3',
    text : 'comment for JS',
    author: '2',
    post : '2'
},
{
    id : '4',
    text : 'comment for graphql',
    author: '3',
    post: '1'

}]
//type definition
const typeDefs = `
    type Query {
        users(query:String):[User!]!
        me : User!
        posts : [Post!]!
        comments : [Comment!]!
    }
    type Mutation{
        createUser(data : CreateUserInput!): User!
        createPost(data : CreatePostInput!): Post!
        createComment(data : CreateCommentInput!): Comment!
    }
    input CreateUserInput{
        name:String!
        email:String!
        age: Int
    }
    input CreatePostInput{
        title: String!
        body:String!
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput{
        text:String!
        author:ID!
        post:ID!
    }
    type User {
        id : ID!
        email : String!
        name : String!
        age : Int
        posts : [Post!]!
        comments : [Comment!]!
    }
    type Post {
        id : ID!
        title:String!
        body:String!
        published:Boolean!
        author : User!
        comments : [Comment!]!
    }
    type Comment{
        id:ID!
        text:String!
        author : User!
        post: Post!
    }
    
`;


//resolvers
const resolvers = {
    Query:{
       
        me(){
            return {
                id : '7896',
                name:'Ashish',
                email:'ashish@test.com'
            }
        },
        posts(parent,args,ctx,info){
            if(!args.query){
                return posts
            }

        },
        comments(parent,args,ctx,info){
            if(!args.query){
                return comments
            }
        },
        users(parent,args,ctx,info){
            if(!args.query){
            return users
            }
            return users.filter(user=> user.name.toLowerCase().includes(args.query.toLowerCase()))
        }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
            const emailTaken = users.some( user=> user.email === args.data.email );
            if(emailTaken){
                throw new Error('Email has been taken');
            }
            const user = {
                id : uuidv4(),
                ...args.data
            }
            users.push(user);
            return user
        },
        createPost(parent,args,ctx,info){
            const user = users.some( user=> user.id === args.data.author );
            if(!user){
                throw new Error('Author not found')
            }
            const post = {
                id : uuidv4(),
                ...args.data
            }
            posts.push(post);
            return post;
        },
        createComment(parent,args,ctx,info){
            const user = users.some( user=> user.id === args.data.author );
            const post = posts.some( post=> post.id === args.data.post && post.published);
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
            comments.push(comment);
            return comment;
        }
    },
    Post:{
        author(parent,args,ctx,info){
            return users.find( user => parent.author === user.id);
        },
        comments(parent,args,ctx,info){
            return comments.filter( comm => comm.post === parent.id);
        }
    },
    User: {
        posts(parent,args,ctx,info){
            return posts.filter( post => post.author === parent.id);
        },
        comments(parent,args,ctx,info){
            return comments.filter( comm => comm.author === parent.id);
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find( user => parent.author === user.id);
        },
        post(parent,args,ctx,info){
            return posts.find( post => parent.post === post.id);
        }
    } 
}

const server = new GraphQLServer({typeDefs,resolvers});
server.start(()=>{
    console.log("graphql us up")
});