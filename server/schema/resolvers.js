const { UserList, MovieList } = require("../FakeData");
// const _ = require("lodash");

const resolvers = {

    Query: {

        // USER RESOLVERS
        users: () => {
            // make call to database here

            return UserList;
        },
        user: (parent, args) => {
            const id = Number(args.id)
            const user = UserList.filter(item => item.id === id)
            // const user = _.find(UserList, { id });
            // console.log("user", user)
            return user[0]
        },

        // MOVIE RESOLVERS
        movies: () => {
            return MovieList
        },
        movie: (parent, args) => {
            const name = args.name;
            const movie = MovieList.filter(item => item.name === name);
            return movie[0];
        }
    },

    User: {
        favMovies: () => {
            return MovieList.filter(item => item.yearOfPublication >= 2000 && item.yearOfPublication <= 2010)
        }
    },

    Mutation: {
        createUser: (parent, args) => {
            const user = args.input
            user.id = MovieList.length
            // console.log("user input", user)
            MovieList.push(user)
            return MovieList[MovieList.length - 1];
        },
        updateUsername: (parent, args) => {
            const { id, newUsername } = args.input
            let userUpdated;
            UserList.forEach(item => {
                if (item.id === Number(id)) {

                    item.username = newUsername
                    userUpdated = item

                }
            })
            return userUpdated
        },
        deleteUser: (parent, args) => {
            const id = Number(args.id)
            // remove user based on id
            return UserList.pop()
        }
    }

}

module.exports = { resolvers }