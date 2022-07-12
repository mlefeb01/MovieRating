import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { web3, ratingContract } from "./setup.js";
import { ShowMovies } from "./components/showmovies/ShowMovies";
import { AddMovie } from "./components/addmovie/AddMovie";
import { SelectAccount } from "./components/selectaccount/SelectAccount";

class App extends Component {

  constructor(props) {
    super(props)

    this.handleVoting = this.handleVoting.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

    // load movies
    const movies = [];
    const numMovies = ratingContract.numMovies();
    for (let n = 0; n < numMovies; n++) {
      const rawMovie = ratingContract.movies(n);
      movies.push({
        id: n,
        name: web3.toUtf8(rawMovie[0]),
        votes: rawMovie[1].toNumber()
      });
    }

    // GRAB CURRENT BLOCK NUMBER WHEN COMPONENT IS CREATED TO IGNORE EVENTS IN THE PAST (emmiter will emit events from last block)
    const currentBlock = web3.eth.blockNumber;

    // need reference to this component for event listener callbacks
    const context = this;

    // listen for AddMovie events emitted from the smart contract
    const addListener = ratingContract.AddMovie([], [], function (error, result) {
      if (error || result.blockNumber === currentBlock) {
        return;
      }

      const from = result.args.from;
      const id = result.args.index.toNumber();
      const name = web3.toUtf8(result.args.movieName);

      const movies = context.state.movies;
      movies.push({
        id: id,
        name: name,
        votes: 0
      });
      context.setState({
        movies: movies,
        addListener: context.state.addListener,
        voteListener: context.state.voteListener
      });
    });

    // listen for AddVote events emitted from the smart contract
    const voteListener = ratingContract.AddVote([], [], function (error, result) {
      if (error || result.blockNumber === currentBlock) {
        return;
      }
      
      const from = result.args.from;
      const id = result.args.index.toNumber();

      const movies = context.state.movies;
      movies[id].votes++;
      context.setState({
        movies: movies,
        addListener: context.state.addListener,
        voteListener: context.state.voteListener
      })
    });

    this.state = { movies, addListener, voteListener };
  }

  componentWillUnmount() {
    this.state.addListener.stopWatching();
    this.state.voteListener.stopWatching();
  }

  handleVoting(movie) {
    try {
      ratingContract.voteForMovie(movie.id);
    } catch (err) {
      console.log(err);
      alert("You have already voted for this movie!")
    }
  }

  handleAdd(movieName) {
    if (!movieName) {
      alert("Enter a movie name!");
      return;
    }

    try {
      ratingContract.addMovie(movieName);
    } catch (err) {
      console.log(err);
      alert(`${movieName} already exists!`);
    }
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Movie Rating Application in Ethereum and React
        </p>
        <div>
          <SelectAccount web3={web3} />
        </div>
        <div>
          <AddMovie ratingContract={ratingContract} add={this.handleAdd} web3={web3} />
        </div>
        <div className="movie-table">
          <ShowMovies movies={this.state.movies} vote={this.handleVoting} />
        </div>
      </div>
    );
  }
}

export default App;