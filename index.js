import { GoogleGenerativeAI } from "@google/generative-ai";

// Your Gemini API key
const GEMINI_API_KEY = "" ;

// Your Unsplash API access key
const UNSPLASH_ACCESS_KEY = "vt_tQacVvuZk_raty1o_WXoQxNmU7EStKB_T2ifwR70";

const generateStoryBtn = document.getElementById("generate-story-btn");
generateStoryBtn.addEventListener("click", generateStory);

const generatePhotoBtn = document.getElementById("generate-photo-btn");
generatePhotoBtn.addEventListener("click", generatePhoto);

const storyInput = document.getElementById("story-input");
storyInput.addEventListener("focus", handleTextAreaFocus);
storyInput.addEventListener("blur", handleTextAreaBlur);

async function generateStory() {
  const storyInput = document.getElementById("story-input").value;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Show spinner while generating story
  const spinner = document.getElementById("spinner");
  spinner.style.display = "flex";

  try {
    const result = await model.generateContent(storyInput);
    const response = await result.response;
    let story = await response.text();

    // Remove asterisks and format response text
    story = story.replace(/\*/g, "");
    story = story.replace(/\s(?=\w)/g, " ");
    story = story.replace(/(?:\r\n|\r|\n)/g, "<br />");

    displayStory(story);
  } catch (error) {
    console.error("Error generating story:", error);
    displayError("Sorry, I am having trouble generating the story.");
  } finally {
    // Hide spinner after generating story
    spinner.style.display = "none";
  }
}

function displayStory(story) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<p>${story}</p><hr />`; // Add <br> after the paragraph
}

function displayError(message) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<p class="error">${message}</p>`;
}

async function generatePhoto() {
  const query = document.getElementById("story-input").value;
  const apiUrl = `https://api.unsplash.com/photos/random?query=${query}&count=6&client_id=${UNSPLASH_ACCESS_KEY}`;

  // Show spinner while generating photos
  const spinner = document.getElementById("spinner");
  spinner.style.display = "flex";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && Array.isArray(data) && data.length > 0) {
      displayPhotos(data);
    } else {
      displayError("Failed to fetch photos.");
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    displayError("Failed to fetch photos.");
  } finally {
    // Hide spinner after generating photos
    spinner.style.display = "none";
  }
}

function displayPhotos(photos) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = photos
    .map(
      (photo) =>
        `<img src="${photo.urls.regular}" alt="Generated Photo" class="generated-photo">`
    )
    .join("");
}

function displayPhoto(photoUrl) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<img src="${photoUrl}" alt="Generated Photo" class="generated-photo">`;
}

function handleTextAreaFocus() {
  const storyInput = document.getElementById("story-input");
  storyInput.style.borderColor = "purple";
  storyInput.style.height = "120px";
}

function handleTextAreaBlur() {
  const storyInput = document.getElementById("story-input");
  storyInput.style.borderColor = "";
  storyInput.style.height = "";
}
