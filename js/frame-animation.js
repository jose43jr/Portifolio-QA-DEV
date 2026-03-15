// Frame-by-Frame Hero Animation
// Handles the loading and rendering of image sequences on a canvas to simulate a video.

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-frame-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configuration
    const frameCount = 147;
    const framePath = 'frame a frame/frame';
    const extension = '.png';
    
    // State
    const frames = [];
    let currentFrame = 1;
    let isImagesLoaded = false;
    
    // Load images
    const loadImages = () => {
        let loadedCount = 0;
        
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Pad start with 0s to match format frame00001.png
            const paddedIndex = String(i).padStart(5, '0');
            img.src = `${framePath}${paddedIndex}${extension}`;
            
            img.onload = () => {
                loadedCount++;
                
                // Once a reasonable amount of frames is loaded, we can allow scrolling updates
                if (loadedCount >= 10 && !isImagesLoaded) {
                    isImagesLoaded = true;
                    updateFrameOnScroll(); // Initial draw based on current scroll
                }
                
                // If the very first frame loads, draw it immediately to avoid empty space
                if (i === 1) {
                    drawFrame(img);
                }
            };
            
            frames[i] = img;
        }
    };
    
    // Maintain aspect ratio cover logic
    const drawFrame = (img) => {
         if (!img || !img.complete || img.naturalWidth === 0) return;

         // Get canvas dimensions
         const cWidth = canvas.width;
         const cHeight = canvas.height;
         
         // Get image dimensions
         const { width: iWidth, height: iHeight } = img;
         
         // Calculate ratios
         const widthRatio = cWidth / iWidth;
         const heightRatio = cHeight / iHeight;
         
         // To achieve "cover" effect, use the larger ratio
         const ratio = Math.max(widthRatio, heightRatio);
         
         const newWidth = iWidth * ratio;
         const newHeight = iHeight * ratio;
         
         // Calculate positioning to center the image
         // object-position: center 0% equivalent (top aligned)
         const offsetX = (cWidth - newWidth) / 2;
         const offsetY = 0; // Align top like the original object-position: center 0%
         
         // Clear previous frame
         ctx.clearRect(0, 0, cWidth, cHeight);
         
         // Draw new frame
         ctx.drawImage(img, 0, 0, iWidth, iHeight, offsetX, offsetY, newWidth, newHeight);
    };
    
    // Scroll Logic
    const updateFrameOnScroll = () => {
        if (!isImagesLoaded) return;
        
        // Calculate the container bounds (the hero section)
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        
        const rect = heroSection.getBoundingClientRect();
        
        // When rect.top is 0, we are at the top of the hero section.
        // We want the animation to progress as we scroll down through the hero section.
        // The scrollable distance inside the hero is its total height minus the viewport height.
        const scrollableDistance = rect.height - window.innerHeight;
        
        // How far we have scrolled into the hero section (starting from 0 when the top of hero hits the top of viewport)
        // Note: rect.top is negative as we scroll down
        const scrolledDistance = -rect.top;
        
        let scrollFraction = 0;
        
        if (scrolledDistance > 0 && scrollableDistance > 0) {
            scrollFraction = Math.min(1, scrolledDistance / scrollableDistance);
        } else if (scrolledDistance <= 0) {
             scrollFraction = 0;
        } else {
             scrollFraction = 1;
        }

        // Map the fraction to a frame between 1 and frameCount
        const targetFrame = Math.max(1, Math.min(frameCount, Math.floor(scrollFraction * frameCount) + 1));
        
        if (targetFrame !== currentFrame) {
             currentFrame = targetFrame;
             
             // Redraw if the target frame is loaded
             if (frames[currentFrame] && frames[currentFrame].complete) {
                 requestAnimationFrame(() => {
                     drawFrame(frames[currentFrame]);
                 });
             }
        }
    };
    
    // Attach scroll listener
    window.addEventListener('scroll', updateFrameOnScroll, { passive: true });
    
    // Handle resizing
    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        // In the CSS the video takes 50% width on desktop and 100% on mobile. 
        // We need to match the actual CSS dimensions.
        // We get the computed size of the parent or the canvas itself to be accurate.
        
        // Let's use bounding client rect to get the exact rendered dimensions
        const rect = canvas.getBoundingClientRect();
        
        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // Normalize coordinate system to use css pixels
        ctx.scale(dpr, dpr);
        
        // Ensure canvas CSS width/height are set implicitly by layout.css
        // But we update rendering dimensions here.
        
        // Redraw current frame immediately on resize
        if (frames[currentFrame] && frames[currentFrame].complete) {
            // Need to set the width/height of the internal canvas context without dpr scaling for the draw logic
             canvas.width = rect.width;
             canvas.height = rect.height;
             
             // Reset transform to identity since we overwrote the width/height which resets it anyway
             ctx.setTransform(1, 0, 0, 1, 0, 0); 
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             drawFrame(frames[currentFrame]);
        }
    };
    
    // Initial setup
    window.addEventListener('resize', resizeCanvas);
    
    // Trigger initial resize to set up correct dimensions based on CSS before loading images
    resizeCanvas();
    loadImages();
});
