document.addEventListener("DOMContentLoaded", async () => {
  // 1. Select the HTML elements using the IDs from your index.html
  const heroSubtitle = document.getElementById("hero-subtitle"); // The olive 'ABOUT ME' text
  const heroName = document.getElementById("hero-name");         // Large Full Name
  const heroDesc = document.getElementById("hero-desc");         // Professional Bio
  const heroImg = document.getElementById("hero-img");           // Profile Photo
  const linkedinLink = document.getElementById("hero-linkedin");
  const githubLink = document.getElementById("hero-github");

  // Your local API endpoint for the public hero data
  const API_URL = "http://127.0.0.1:5050/api/public/hero";

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Could not fetch hero data");

    const data = await res.json();

    // Handle both array responses and single object responses
    const hero = Array.isArray(data) ? data[0] : data;

    if (hero) {
      // Mapping CMS "Greeting" to the "ABOUT ME" subheading
      if (heroSubtitle) heroSubtitle.innerText = hero.greeting || "ABOUT ME";

      // Mapping CMS "Name"
      if (heroName) heroName.innerText = hero.name || "Atul Dubey";

      // Mapping CMS "Description" to the bio paragraph
      if (heroDesc) heroDesc.innerText = hero.description || "";

      // Update the profile image if it exists
      if (heroImg && hero.image) {
        heroImg.src = hero.image;
      }

      // Update Social Links if provided in the CMS
      // Inside hero-public.js - Update social links section
      if (linkedinLink && hero.socialLinks?.linkedin) {
        const url = hero.socialLinks.linkedin;
        linkedinLink.href = url.startsWith('http') ? url : `https://${url}`;
      }
      if (githubLink && hero.socialLinks?.github) {
        const url = hero.socialLinks.github;
        githubLink.href = url.startsWith('http') ? url : `https://${url}`;
      }

      console.log("Hero Section successfully synced from CMS.");
    }
  } catch (err) {
    console.error("Hero Section Load Error:", err);
  }
});