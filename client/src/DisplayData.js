import React, { useState } from 'react'
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client'



const QUERY_ALL_USERS = gql`
query GET_USERS { 
users {
        id
        name
        username
        age
    }
}
`
const QUERY_ALL_MOVIES = gql`
query GET_MOVIES {
    movies {
        id
        name
        yearOfPublication
        isInTheaters
    }
}
`

const QUERY_MOVIE = gql`
query GET_MOVIE_ByName($name: String!) {
    movie(name: $name) {
        name
        yearOfPublication
    }
}
`

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: createUserInput!) {
        createUser(input: $input) {
            id
            name
            age
        }
    }
`

export default function DisplayData() {

    const [movieSearched, setMovieSearched] = useState("");
    const [userState, setUserState] = useState({
        name: '',
        username: '',
        age: '',
        nationality: ''
    })

    const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [fetchMovie, { data: movieSearchData, error: movieError }] = useLazyQuery(QUERY_MOVIE)

    const [createUser, { data: createUserData }] = useMutation(CREATE_USER_MUTATION)

    const handleChange = (key, value) => {
        // if (key === "age") { value = Number(value) }
        setUserState(prev => ({ ...prev, [key]: value }))
    }


    if (loading)
        return <div>Data is Loading</div>

    if (error) {
        console.log("error", error)
    }

    if (movieData)
        console.log("movieData", movieData)

    if (createUserData)
        console.log("first", createUserData)

    return (
        <div>

            <div>
                <input type="text" value={userState.name} placeholder="Name" onChange={(e) => { handleChange("name", e.target.value) }} />
                <p />
                <input type="text" value={userState.username} placeholder="Username" onChange={(e) => { handleChange("username", e.target.value) }} />
                <p />
                <input type="number" value={userState.age} placeholder="Age" onChange={(e) => { handleChange("age", Number(e.target.value)) }} />
                <p />
                <input type="text" value={userState.nationality} placeholder="Nationality" onChange={(e) => { handleChange("nationality", e.target.value) }} />
                <p />
                <button onClick={() => {

                    createUser({ variables: { input: userState } })
                    refetch()
                }}>
                    Create User
                </button>
            </div>
            <p />

            <input
                type="text"
                placeholder='Interstellar...'
                value={movieSearched}
                onChange={(e) => {
                    setMovieSearched(e.target.value)
                }}
            />
            <button onClick={() => fetchMovie({ variables: { name: movieSearched } })}>Search movie</button>
            <div>
                search movie details:
                {
                    movieSearchData &&
                    <div>
                        Name: {movieSearchData.movie.name}
                        Year of Publication: {movieSearchData.movie.yearOfPublication}
                    </div>

                }
                <h1></h1>

            </div>

            {
                data && data.users.map((user) => {
                    return (
                        <div key={user.id}>
                            <h1>Name: {user.name}</h1>
                            <h1>Username: {user.username}</h1>
                            <h1>Age: {user.age}</h1>

                        </div>
                    )
                })
            }

            {
                movieData && movieData.movies.map(movie => {
                    return (
                        <div key={movie.id}>
                            <h1>Movie Name: {movie.name}</h1>
                            <h1>year of publication: {movie.yearOfPublication}</h1>
                            <h1>isInTheaters: {movie.isInTheaters ? "yes" : "no"}</h1>

                        </div>
                    )

                })
            }

        </div>
    )
}
