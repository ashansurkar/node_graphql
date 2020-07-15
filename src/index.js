import { GraphQLServer } from 'graphql-yoga';

//type definition
const typeDefs = `
    type Query {
        me : User!
        post : Post!
    }
    type User {
        id : ID!
        email : String!
        name : String!
        age : Int
    }
    type Post {
        id : ID!
        title:String!
        body:String!
        published:Boolean!
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
        post(){
            return {
                id:'345',
                title : 'graphql getting started',
                body : 'getting started with node and graphql is easy',
                published : true
            }
        }
    }
}

const server = new GraphQLServer({typeDefs,resolvers});
server.start(()=>{
    console.log("graphql us up")
});