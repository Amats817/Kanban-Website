document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.getElementById("create-board-modal");
    const closeBtn = document.querySelector(".close-btn");
    const createBoardForm = document.getElementById("create-board-form");
    const confirmationMsg = document.getElementById("confirmation-msg");
    const errorMsg = document.getElementById("error-msg");
    const boardTitleInput = document.getElementById("board-title");
    const boardMembersInput = document.getElementById("board-members");
    const createBoardBtn = document.getElementById("create-board-btn");
    const boardsContainer = document.getElementById("boards-container");
  
    function toggleModal() {
      modal.style.display = modal.style.display === "block" ? "none" : "block";
    }
  
    createBoardBtn.addEventListener("click", () => {
      toggleModal();
    });
   
    closeBtn.addEventListener("click", () => {
      toggleModal();
    });
  
    // form submission to create a new board
    createBoardForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const boardTitle = boardTitleInput.value.trim();
      const owner = localStorage.getItem("currentUser");
  
      if (!boardTitle) {
        displayError("Board title cannot be empty.");
        return;
      }
  
      try {
        // Create the board
        const boardResponse = await fetch("/api/boards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: boardTitle, owner: owner }),
        });
  
        if (!boardResponse.ok) {
          throw new Error("Failed to create board.");
        }
  
        const newBoard = await boardResponse.json();
        displayBoard(newBoard);
  
        // Store the boardId in localStorage
        localStorage.setItem("currentBoardId", newBoard._id);
  
        toggleModal();
        window.location.reload();
      } catch (err) {
        console.error("Error creating board:", err);
        displayError("An error occurred while creating the board.");
      }
    });
  
    function displayBoard(boardData) {
      const boardItem = document.createElement("div");
      boardItem.classList.add("board-item");
      boardItem.innerHTML = `
        <h2>${boardData.title}</h2>
        <p>Owner: ${boardData.owner}</p>
        <button class="view-board-btn">View Board</button>
        <button class="delete-board-btn">Delete Board</button>
      `;
  
      // Add data attribute to store board ID
      boardItem.dataset.boardId = boardData._id;
  
      // Append the new board item to the board list container
      boardsContainer.appendChild(boardItem);
    }
  
    // deleting a board
    boardsContainer.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-board-btn")) {

        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin !== "true") {
          alert("Only admins can delete boards.");
          return;
        }
        
        const boardItem = e.target.closest(".board-item");
        const boardId = boardItem.dataset.boardId;
  
        try {
          const response = await fetch(`/api/boards/${boardId}`, {
            method: "DELETE",
          });
  
          if (!response.ok) {
            throw new Error("Failed to delete board");
          }
  
          const result = await response.json();
          alert(result.message);
          boardItem.remove();
        } catch (err) {
          console.error("Error deleting board:", err);
          alert("An error occurred while deleting the board");
        }
      }
    });
  
    // viewing tasks of a board
    boardsContainer.addEventListener("click", async (e) => {
      if (e.target.classList.contains("view-board-btn")) {
        const boardItem = e.target.closest(".board-item");
        const boardId = boardItem.dataset.boardId;
  
        if (boardId) {
          // Store board ID in localStorage
          localStorage.setItem("currentBoardId", boardId);
  
          window.location.href = "board.html";
        }
      }
    });
  
    // Fetch all boards from the database and display them on the dashboard
    async function fetchAndDisplayBoards() {
      try {
        const response = await fetch("/api/boards");
        if (response.ok) {
          const boardsData = await response.json();
  
          boardsContainer.innerHTML = "";
  
          // Display boards in the dashboard
          boardsData.forEach((board) => {
            displayBoard(board);
          });
        } else {
          throw new Error("Failed to fetch boards.");
        }
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    }
  
    // Call the function to fetch and display all boards when the DOM is loaded
    await fetchAndDisplayBoards();
  });  