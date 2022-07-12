import React, { Component } from 'react';
import './ShowMovies.css'

export class ShowMovies extends Component {
    
    handleChange(movie) {
        this.props.vote(movie);
    }

    render() {
        let movieList = this.props.movies.map((movie, i) =>
            <tr key={i}>
                <td onClick={this.handleChange.bind(this, movie)}>{movie.name}</td>
                <td>{movie.votes}</td>
            </tr>)

        return (
            <div>
                <h3> Movies</h3>
                <table >
                    <tbody>
                        <tr>
                            <th>Movie</th>
                            <th>Votes</th>
                        </tr>
                        {movieList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ShowMovies;