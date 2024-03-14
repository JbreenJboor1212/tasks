<template>
  <div id="boos" class="w-full h-screen">
    <header
      id="header"
      class="relative flex items-end justify-center px-3 py-2"
    >
      <nav id="nav" class="flex justify-between w-5/6">
        <div class="w-[130px] md:w-[200px] flex items-center">
          <p id="po" class="font-bold text-20">Gallery</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <label for="file-upload" class="upload-label">Upload</label>
            <input
              class="hidden"
              type="file"
              id="file-upload"
              accept="image/*"
              ref="fileInput"
              @change="handleFileUpload"
            />
          </div>
        </div>
      </nav>
    </header>

    <div id="div-parent" class="image-container">
      <p class="para">{{ errorMessage }}</p>
      <div
        class="div-child"
        v-for="(imageBase64, index) in imageBase64Array"
        :key="index"
      >
        <img :src="imageBase64" alt="Uploaded Image" />
        <button class="button" @click="removeImage(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageBase64Array: [],
      errorMessage: "No Message",
    };
  },
  mounted() {
    // Load image data from local storage when the component is mounted
    const imageData = localStorage.getItem("uploadedImages");
    if (imageData) {
      this.imageBase64Array = JSON.parse(imageData);
    }
  },
  methods: {
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Validate file type
        if (!file.type.startsWith("image/")) {
          this.errorMessage = `File ${file.name} is not an image.`;
          return;
        }
        // Validate file size
        if (file.size > 2 * 1024 * 1024) {
          this.errorMessage = `Maximum file size for ${file.name} is 2MB.`;
          return;
        }
        const reader = new FileReader();
        reader.onload = async () => {
          this.imageBase64Array.push(reader.result);
          // Save image data to local storage
          localStorage.setItem(
            "uploadedImages",
            JSON.stringify(this.imageBase64Array)
          );
          this.errorMessage = "";

          //Upload To Server
          //imagePreviewUrl.value = reader.result;
          // Extract the base64 encoded image data
          const base64Image = reader.result.split(",")[1];
          try {
            // Send the image data to the server
            const response = await fetch(
              "https://vintrackers.buildonlinestaging.com/upload/images/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json", // Set content type to JSON
                },
                body: JSON.stringify({ images: [base64Image] }), // Convert image to base64 and include in the array
              }
            );
            if (!response.ok) {
              throw new Error("Failed to upload image.");
            }

            //console.log("Image uploaded successfully.");
            this.errorMessage = "Image uploaded successfully.";
          } catch (error) {
            console.error("Error uploading image:", error);
            this.errorMessage = `Image uploaded successfully. ${error}`;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage(index) {
      // Remove the image at the specified index
      this.imageBase64Array.splice(index, 1);

      // Update local storage
      localStorage.setItem(
        "uploadedImages",
        JSON.stringify(this.imageBase64Array)
      );

      this.errorMessage = "Image removed successfully.";
    },
  },
};
</script>

<style scoped>
#boos {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#header {
  padding: 10px;
  padding-top: 20px;
  height: 120px;
  width: 100%;
  border-bottom: 1px solid gray;
}

#po {
  font-weight: bold;
  font-size: 24px;
}

.para {
  text-align: center;
  width: 100%;
  color: #3498db;
  font-weight: 600;
  font-size: 20px;
  padding: 10px;
}

#div-parent {
  height: calc(100vh - 80);
  width: 80%;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.div-child {
  width: 18%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.div-child img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
}

.button {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: black;
  font-size: 18px;
  position: absolute;
  top: 10px;
  right: 10px;
  border: 1px solid rgb(153, 148, 148);
}

.upload-label {
  cursor: pointer;
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 18px;
}

.upload-label:hover {
  background-color: white;
  color: #3498db;
  border: 1px solid #3498db;
}

.inputOne {
  display: none;
}

@media (max-width: 1000px) {
  .div-child {
    width: 48%;
  }
}

@media (max-width: 670px) {
  .div-child {
    width: 100%;
  }
}
</style>
