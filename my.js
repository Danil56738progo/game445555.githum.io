document.addEventListener("DOMContentLoaded", () => {
  const player = document.querySelector(".player");
  const bullet = document.querySelector(".bullet");
  const enemiesContainer = document.querySelector(".enemies");
  const scoreDisplay = document.getElementById("score");
  const recordDisplay = document.getElementById("record");
  const restartBtn = document.querySelector(".restart-btn");
  const exitBtn = document.querySelector(".exit-btn");

  let score = 0;
  let record = localStorage.getItem("record") || 0;
  let gameInterval;

  recordDisplay.textContent = record;

  function movePlayer(event) {
    if (event.key === "ArrowLeft") {
      let leftPosition = parseInt(
        window.getComputedStyle(player).getPropertyValue("left")
      );
      if (leftPosition > 0) {
        player.style.left = `${leftPosition - 10}px`;
      }
    }
    if (event.key === "ArrowRight") {
      let leftPosition = parseInt(
        window.getComputedStyle(player).getPropertyValue("left")
      );
      if (leftPosition < window.innerWidth - 50) {
        // Ширина корабля игрока
        player.style.left = `${leftPosition + 10}px`;
      }
    }
    if (event.key === " ") {
      fireBullet();
    }
  }

  function fireBullet() {
    if (bullet.style.display === "none") {
      let playerPosition =
        parseInt(window.getComputedStyle(player).getPropertyValue("left")) + 22; // Позиция вылета пули
      let playerBottom =
        parseInt(window.getComputedStyle(player).getPropertyValue("bottom")) +
        50; // Высота вылета пули
      bullet.style.left = `${playerPosition}px`;
      bullet.style.bottom = `${playerBottom}px`; // Высота вылета пули
      bullet.style.display = "block";

      let bulletInterval = setInterval(() => {
        let bulletRect = bullet.getBoundingClientRect();
        let asteroids = document.querySelectorAll(".asteroid");

        asteroids.forEach((asteroid) => {
          let asteroidRect = asteroid.getBoundingClientRect();
          if (isColliding(bulletRect, asteroidRect)) {
            asteroid.remove();
            score++;
            scoreDisplay.textContent = score;
            clearInterval(bulletInterval);
            bullet.style.display = "none";
          }
        });

        let bulletPosition = parseInt(
          window.getComputedStyle(bullet).getPropertyValue("bottom")
        );
        if (bulletPosition >= window.innerHeight - 20) {
          clearInterval(bulletInterval);
          bullet.style.display = "none";
        } else {
          bullet.style.bottom = `${bulletPosition + 10}px`;
        }
      }, 50);
    }
  }

  function isColliding(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  function createAsteroid() {
    let asteroid = document.createElement("div");
    asteroid.classList.add("asteroid");
    asteroid.style.left = `${Math.floor(
      Math.random() * (window.innerWidth - 50)
    )}px`; // Размер астероида
    enemiesContainer.appendChild(asteroid);

    let asteroidInterval = setInterval(() => {
      let asteroidPosition = parseInt(
        window.getComputedStyle(asteroid).getPropertyValue("top")
      );
      if (asteroidPosition >= window.innerHeight - 20) {
        asteroid.remove();
        clearInterval(asteroidInterval);
      } else {
        asteroid.style.top = `${asteroidPosition + 15}px`; // Увеличена скорость астероидов
        checkCollision(asteroid);
      }
    }, 200); // Изменен интервал для ускорения астероидов
  }

  function checkCollision(asteroid) {
    let playerRect = player.getBoundingClientRect();
    let asteroidRect = asteroid.getBoundingClientRect();

    if (isColliding(playerRect, asteroidRect)) {
      gameOver();
    }

    let bulletRect = bullet.getBoundingClientRect();
    if (isColliding(bulletRect, asteroidRect)) {
      asteroid.remove();
      score++;
      scoreDisplay.textContent = score;
      bullet.style.display = "none";
    }

    if (score > record) {
      record = score;
      recordDisplay.textContent = record;
      localStorage.setItem("record", record);
    }
  }

  function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    score = 0;
    scoreDisplay.textContent = score;
    enemiesContainer.innerHTML = "";
    showButtons();
  }

  function showButtons() {
    restartBtn.style.display = "block";
    exitBtn.style.display = "block";

    restartBtn.addEventListener("click", restartGame);
    exitBtn.addEventListener("click", exitGame);
  }

  function hideButtons() {
    restartBtn.style.display = "none";
    exitBtn.style.display = "none";

    restartBtn.removeEventListener("click", restartGame);
    exitBtn.removeEventListener("click", exitGame);
  }

  function restartGame() {
    hideButtons();
    startGame();
  }

  function exitGame() {
    hideButtons();
    alert("Exiting the game.");
    // Дополнительный код для выхода из игры может быть добавлен здесь
  }

  function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    gameInterval = setInterval(createAsteroid, 1000); // Интервал появления новых астероидов
  }

  startGame();
  document.addEventListener("keydown", movePlayer);
});
