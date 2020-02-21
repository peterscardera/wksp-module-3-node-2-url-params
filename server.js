'use strict';

const morgan = require('morgan');
const express = require("express");

const { top50 } = require('./data/top50');
const {books} = require('./data/books');

const PORT = process.env.PORT || 8000;
const app = express();


//---------------------------------SONGS----------------------------------------//


const topFifty = (req,res) => res.render("pages/top50", {
    title:"Top 50 Songs Streamed on Spotify",
    top50:top50  // we called it top50: but could be anything else but change in forEach thn
});

const popularArtist = (req, res) =>  {
   
    // -----------------

    let rankingSystem = [];
    // const allArtists = Object.values(top50[0].title).join("");
    let countedArtists = {};
    top50.forEach((current) => {
      let streamCount = 0;
      //Now artist is holding the artist name of each item.
      let artist = Object.values(current.artist).join('');
  
      top50.forEach((compared) => {
        if (current.artist === compared.artist) {
          streamCount += compared.streams;
        }
          })
      //Here, we are taking the current artist name and putting it in the object counted Artists with that KEY. The KEY now is equal to the streamcount.
      countedArtists[current.artist] = streamCount;
      //it only goes through the current artist once.
    });
    
    Object.values(countedArtists).forEach((stream,locationIndex)=> {
      let artistName = Object.keys(countedArtists)[locationIndex]
      rankingSystem.push({
        artistName: artistName,
        stream: stream
      })
    })
    
    rankingSystem.sort((a,b)=> {
     return b.stream - a.stream
    })
    //now we know justing is the most popular
    
     const filteredArray = top50.filter(current => current.artist === rankingSystem[0].artistName)
    // console.log(filteredArray)
    

    // ------------

    res.render("pages/popularArtists", {
        title: "Most Popular Songs streamed on Spotify",
        popSongs: filteredArray
    })
}

const rankedSongs = (req,res ) => {
    const number = req.params.number;

    let song = top50[number - 1 ];

    if(song) {
      res.render("pages/rankedSongs", {
        title: `Song #${number}`,
        pickedSong: song 
      });
      
} else {
  res.status(404)
  res.render('pages/fourOhFour', {
    title: 'I got nothing',
    path: req.originalUrl
      });
    }
}


//---------------------------------BOOKS----------------------------------------//


// 1 -adding the book number on the url will bring us to the specific book
const bookshelf = (req, res) => {
  res.render("pages/topbooks", {
    title: "Top books",
    bookList: books
  })
}
const individualBook = (req, res) => {
  const id = req.params.id;

  let bookInObj = books[id - 101]

  if(bookInObj) {
    res.render("pages/rankedBooks", {
      title: `Details on ${bookInObj.title} by ${bookInObj.author}`,
      pickedBook: bookInObj
    })
  }else {
    res.status(404)
    res.render('pages/fourOhFour', {
      title: 'I got nothing',
      path: req.originalUrl
        });
      }
}
//2 -clicking a specific book from the /topbooks page to bring us to that detailed version of the book. I created a new ejs file with more on it then the homepage 
//that gets done with the anchor tag on books.ejs once each page has the above set up 

//3 able to get a list of books by their type

const byType = (req, res) => {
  const type = req.params.type;

let collectionOfTypes = [];

books.forEach((individualBook) => {

if(individualBook.type == type) {
  collectionOfTypes.push(individualBook)
}

})

if(collectionOfTypes.length > 0) {
res.render("pages/filterBooks", {
  title: `test`,
  filterByType: collectionOfTypes
})

}else {
  res.status(404)
  res.render('pages/fourOhFour', {
    title: 'I got nothing',
    path: req.originalUrl
      });
    }


  

}

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

// endpoints here
app.get("/top50",topFifty);
app.get("/top50pop", popularArtist);
app.get("/top50/:number", rankedSongs);

app.get("/topbooks", bookshelf);
app.get("/topbooks/:id", individualBook);
app.get("/topbooks/genre/:type", byType);

// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
