/*******************************************************************************
 * MAIN GAME LOGIC WILL GO IN HERE...
 ******************************************************************************/
let scoreboard = new Scoreboard("scoreboard");
scoreboard.update(100);
scoreboard.update(-10);

let timer = new Timer("timer", 10);
timer.startCountdown();
