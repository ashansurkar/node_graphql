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
const db = {
    users,
    posts,
    comments
}
export { db as default }