// Use strict mode! For more info on strict mode see:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

/*******************************************************************************
 * GameComponent
 * -------------
 * This is a constructor function for an object that represents a generalized
 * "base" object that will be used by more specialized objects used in the game.
 * In terms of OO design, we are practicing encapsulation—all of the common
 * functionality that a game component needs will be part of this object.
 *
 * All components that we'll be working with in the game will ultimately be
 * part of the DOM (i.e. elements of the HTML document). In order to manipulate
 * those game objects in code we will need to get a refernece to them using
 * document.getElementById. By packaging that and some error handling code up
 * in this object constructor function, we will not have to repeat this code in
 * our other game objects—instead those objects will inherit from this one.
 *
 * Note: there is room for better custom error creation within, but that is
 * outside the scope of this example.
 ******************************************************************************/
function GameComponent(idValue) {
  // Note the use of function scoped variables to achieve the equivalent of
  // private properties. These variables can only be accessed within the
  // constructor function (and inner functions defined within, if any). These
  // variables are not created using the this keyword and will not be part of
  // the object returned by new when creating an instance of this object.
  // Compare this with the public method getElement which is defined later.
  const id = idValue;
  const element = document.getElementById(id);

  if (element === null) {
    const err = new Error(`No element exists with id="${id}".`);
    err.name = "HtmlElementNotFound";
    throw err;
  }

  // The getElement method is a public method since it is defined using the this
  // keyword, therefore it can be called by any instance of a GameObject object.
  this.getElement = function() {
    return element;
  };
}

/*******************************************************************************
 * TextComponent (GameComponent <- TextComponent )
 * -----------------------------------------------
 * This is a constructor function for an object that represents a specialized
 * text-based game component. Objects created from this constructor function
 * will inherit (or be "derived") from a GameComponent object. This means these
 * objects will have their own specialized functionality in addition to the
 * functionality available via the GameComponent object.
 *
 * In terms of OO design, we are accomplishing a few things here. We are
 * practicing inheritance—the functionality of GameComponent is being
 * inherited by our TextComponent objects (through the Prototype chain). We are
 * practicing encapsulation—all the functionality that a text-based component
 * needs will be defined by this object. You can also see abstraction in use—
 * users of this object will not be exposed to the complexity of the internal
 * Element object (https://developer.mozilla.org/en-US/docs/Web/API/Element),
 * such as having access to properties like Element.children, Element.classList,
 * and so foth. This object hides that complexity and just exposes the relevant
 * detail, a way for the object to update the text displayed for the component
 * it represents in the game (this is done via the setText method defined on the
 *  object's Prototype).
 ******************************************************************************/
function TextComponent(idValue) {
  GameComponent.call(this, idValue);
}

TextComponent.prototype = Object.create(GameComponent.prototype);
TextComponent.prototype.constructor = TextComponent;

TextComponent.prototype.setText = function setText(value) {
  this.getElement().innerText = value;
};

/*******************************************************************************
 * Scoreboard (GameComponent <- TextComponent <- Scoreboard)
 * ---------------------------------------------------------
 * This is a constructor function for an object that represents the Scoreboard
 * used in the game. Objects created from this constructor function are a
 * specialized TextComponent object—they inherit (or are "derived") from a
 * TextComponent object. This means these objects have functionality specific to
 * a Scoreboard in addition to the functionality available via the TextComponent
 * object.
 *
 * In terms of OO design, we are practicing multiple inheritance—the
 * functionality of GameComponent is being inherited by TextComponent which in
 * turn are inherited by the Scoreboard object (through the Prototype chain). We
 * are practicing encapsulation—all the functionality that a Scoreboard needs
 * will be defined by this object.
 ******************************************************************************/
function Scoreboard(idValue, initialValue = 0) {
  let score = initialValue;

  TextComponent.call(this, idValue);

  const updateDisplay = () => {
    this.setText(`Score: ${score}`);
  };

  // Update the score
  this.update = function update(value) {
    score += value;
    updateDisplay();
  };

  // Reset the scoreboard
  this.reset = function reset() {
    score = initialValue;
    updateDisplay();
  };

  // Initially update the scoreboard display
  updateDisplay();
}

Scoreboard.prototype = Object.create(TextComponent.prototype);
Scoreboard.prototype.constructor = Scoreboard;

/*******************************************************************************
 * Timer (GameComponent <- TextComponent <- Timer)
 * -----------------------------------------------
 * This is a constructor function for an object that represents the Timer
 * used in the game. Objects created from this constructor function are a
 * specialized TextComponent object—they inherit (or are "derived") from a
 * TextComponent object. This means these objects have functionality specific to
 * a Timer in addition to the functionality available via the TextComponent
 * object.
 *
 * In terms of OO design, we are practicing multiple inheritance—the
 * functionality of GameComponent is being inherited by TextComponent which in
 * turn are inherited by the Timer object (through the Prototype chain). We are
 * practicing encapsulation—all the functionality that a Scoreboard needs will
 * be defined by this object.
 ******************************************************************************/
function Timer(idValue, initialTimeValue) {
  TextComponent.call(this, idValue);

  // Private Properties
  const initialTime = initialTimeValue;
  let timeRemaining = initialTime;
  let intervalId;

  // Public Properties
  this.countdownTimerEndCallback = null;

  // update the timer display
  const updateDisplay = () => {
    this.setText(`Time: ${timeRemaining}`);
  };

  // Reset the timer to it's initial value.
  this.reset = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    timeRemaining = initialTime;
    updateDisplay();
  };

  // start Countdown
  this.startCountdown = () => {
    intervalId = setInterval(() => {
      timeRemaining -= 1;
      updateDisplay();

      if (timeRemaining === 0) {
        clearInterval(intervalId);

        // Run something when time's up
        if (this.countdownTimerEndCallback != null) {
          this.countdownTimerEndCallback();
        }
      }
    }, 1000);
  };

  // Initially update the timer display
  updateDisplay();
}

Timer.prototype = Object.create(TextComponent.prototype);
Timer.prototype.constructor = Timer;
