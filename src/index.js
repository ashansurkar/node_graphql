import { GraphQLServer } from 'graphql-yoga';

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
    text : 'comment 1',
    author: '1'
},
{
    id : '2',
    text : 'comment 2',
    author: '2'
},
{
    id : '3',
    text : 'comment 3',
    author: '2'
},
{
    id : '4',
    text : 'comment 4',
    author: '3'
}]
//type definition
const typeDefs = `
    type Query {
        users(query:String):[User!]!
        me : User!
        posts : [Post!]!
        comments : [Comment!]!
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
    }
    type Comment{
        id:ID!
        text:String!
        author : User!
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
    Post:{
        author(parent,args,ctx,info){
            return users.find( user => parent.author === user.id);
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
        }
    }
}

const server = new GraphQLServer({typeDefs,resolvers});
server.start(()=>{
    console.log("graphql us up")
});