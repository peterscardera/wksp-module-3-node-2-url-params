# 3.2.1 - URL Params

---

How do you feel about this? Is this DRY?

<div class='two-col'><div>

```js
// ...
const app = express();

app.get('/question1', q1)
app.get('/question2', q2)
app.get('/question3', q3)
app.get('/question4', q4)
app.get('/question5', q5)
app.get('/question6', q6)
app.get('/question7', q7)
app.get('/question8', q8)
app.get('/question9', q9)
app.get('/question10', q10)
```

</div><div>

```js
// create the possibility of receiving part of the end point as a variable as above is repetative
//because we set the colons it searches for.  the colons is the key part we had to add an extra slash

app.get("/question/:number", (req, res) => {
    const  number = req.params.number

    exercisePI{`q${number}`}
})


//if i were to console.log(number) we would get whatever the person typed in the url
// but what if what we put after the slash doesnt exist? its a problem and will keep loading and loading as the function isnt sending anything back yet

```

</div></div>

---