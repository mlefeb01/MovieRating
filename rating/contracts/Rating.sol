pragma solidity >=0.7.0 <0.9.0;

contract Rating {
  
  struct Movie {
    bytes32 name;
    uint256 votes;
    mapping(address => bool) voted;
  }
  
  mapping(bytes32 => bool) exists;
  Movie[] public movies;

  event AddMovie(address from, bytes32 movieName, uint256 index);

  event AddVote(address from, uint256 index);

  /**
   * @dev Create a new contract instance with the provided names
   * @param names list of movie names
   */
  constructor (bytes32[] memory names) {
    for (uint256 n = 0; n < names.length; n++) {
        initMovie(names[n]);
    }
  }

  /**
   * @dev Modifier that ensures a provided index is valid
   * @param index index
   */
  modifier validIndex(uint256 index) {
    require(index >= 0 && index < movies.length, "Provided index out of bounds");
    _;
  }

  /**
   * @dev Initializes a movie
   * @param name the movie name
   */
  function initMovie(bytes32 name) private {
    Movie storage movie = movies.push();
    movie.name = name;
    exists[name] = true;
    
    emit AddMovie(msg.sender, name, movies.length - 1);
  }

  /**
   * @dev Returns the number of movies
   */
  function numMovies() public view returns (uint256) {
    return movies.length;
  }

  /**
   * @dev Returns the number of votes a movie has
   * @param index index of the movie
   */
  function totalVotesFor(uint256 index) public view validIndex(index) returns (uint256) {
      Movie storage movie = movies[index];
      return movie.votes;
  }

  /**
   * @dev Vote for a movie
   * @param index index of the movie
   */
  function voteForMovie(uint256 index) public validIndex(index) {
      Movie storage movie = movies[index];

      require(!movie.voted[msg.sender], "Sender already voted for this movie!");
      
      movie.voted[msg.sender] = true;
      movie.votes++;

      emit AddVote(msg.sender, index);
  }

  /**
   * @dev Adds a new movie
   * @param movie the movie name
   */
  function addMovie(bytes32 movie) public {
    require(!exists[movie], "Movie already exists!");
    initMovie(movie);
  }

}