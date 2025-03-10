import { useEffect, useState } from 'react'
import words from "./words"
import './App.css'

function Puzzle() {
  //get random word from json list
  const randomIndex = Math.floor(Math.random() * words.length);
  const targetWord = words[randomIndex];

  //set up states to track guess list and target
  const [puzzle, setPuzzle] =useState(targetWord);
  const [guessedLetters, setGuessedLetters] = useState([]);

  //set up use state for lives
  const[lives, setLives] =useState(5)
  //set up use state for when lives is 0
  const[gameOver, setGameOver] = useState(false)

  useEffect(() => {
    setPuzzle(words[Math.floor(Math.random() * words.length)]);
  }, []);

  //replace letters with _ while not guessed
  const displayWord =  puzzle
      // split the word into array of letters
      .split("")
      //see if guessed letteer is a letter in word if not show _
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      //add a space after each letter
      .join(" ")
//handle guess prevent refresh on submit 
 function handleGuess(event) {
  event.preventDefault();
  if(gameOver) return;

  //take input and make normalize to compare
  const guess = event.target.elements.guess.value.toLowerCase();
  //make sure input is only 1 letter
    if(guess.length !==1 || !guess.match(/[a-z]/)){
      //raise alert to handle error
      alert("PLease enter a valid single letter.");
      return;
    }
    //check if letter was already guessed 
    if(guessedLetters.includes(guess)){
      alert("You have already guessed this letter, try again.");
      return;
    }
    //if guess if wrong minus 1 life
    if(!puzzle.includes(guess)){
      setLives(prevLives=> {
        const noMoreLives = prevLives - 1;
        if(noMoreLives === 0) setGameOver(true);
        return noMoreLives;
        });
    }
    //update guessedletters state
    setGuessedLetters(prevGuesses => {
      const updatedGuesses = [...prevGuesses, guess];
    
      // Check if user has guessed all letters
      const winner = puzzle.split("")
        .every(letter => updatedGuesses.includes(letter) || letter === " ");
    
      if (winner) {
        setGameOver(true);
      }
    
      return updatedGuesses;
    });
    

    event.target.reset();
    
    }
    // Restart game function
    function restartGame() {
      setGameOver(false);
      setGuessedLetters([]);
      setLives(5);
      setPuzzle(words[Math.floor(Math.random() * words.length)]);
    }
    

  
    return (
      
      <div className="puzzle-container">
        <h1>Hangman</h1>
        {gameOver && (
          <>
            <h3>
              {lives > 0  
            
              ?`You win!! the word was ${puzzle}.` 
              :`Game over!! The word was ${puzzle}`}
            </h3>
            <button onClick={restartGame}>Restart Game</button> 
          </>
        )}
        <h3>Lives remaining: {lives}</h3>
        <p>{displayWord}</p>
        <form onSubmit={handleGuess}>
          <input type="text" name="guess" maxLength="1" required />
          <button type="submit" disabled={gameOver}>Guess</button>
        </form>
        
        <p>
          <h3>Wrong Guesses: </h3>
          {guessedLetters
          .filter((letter) => !puzzle.includes(letter))
          .join(" ")}
          <p>
            <h3>Available Letters: </h3>
            {"abcdefghijklmnopqrstuvwxyz"
            .split("")
            .filter(letter => !guessedLetters.includes(letter))
            .join(" ")
            }
          </p>
          
        </p>
      </div>
      
    );
  }

export default Puzzle;

