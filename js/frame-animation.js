document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-frame-canvas');
    const poster = document.getElementById('hero-frame-poster');
    const heroSection = document.getElementById('hero');

    if (!canvas || !poster || !heroSection) {
        return;
    }

    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) {
        return;
    }

    const frameFiles = [
        'frame00001.png',
        'frame00006.png',
        'frame00011.png',
        'frame00016.png',
        'frame00021.png',
        'frame00026.png',
        'frame00031.png',
        'frame00036.png',
        'frame00041.png',
        'frame00046.png',
        'frame00051.png',
        'frame00056.png',
        'frame00061.png',
        'frame00066.png',
        'frame00071.png',
        'frame00076.png',
        'frame00081.png',
        'frame00086.png',
        'frame00091.png',
        'frame00096.png',
        'frame00101.png',
        'frame00106.png',
        'frame00111.png',
        'frame00116.png',
        'frame00121.png',
        'frame00126.png',
        'frame00131.png',
        'frame00136.png',
        'frame00141.png'
    ];

    const config = {
        frameBasePath: 'frame a frame/',
        initialBatchSize: 8,
        batchSize: 8,
        mobileBreakpoint: 768,
        rootMargin: '160px 0px'
    };

    const state = {
        currentFrameIndex: 0,
        highestRequestedIndex: -1,
        initialFrameLoaded: false,
        interactiveReady: false,
        isTicking: false,
        hasStartedLoading: false,
        reducedMotionQuery: window.matchMedia('(prefers-reduced-motion: reduce)'),
        desktopQuery: window.matchMedia(`(min-width: ${config.mobileBreakpoint + 1}px)`),
        frames: new Map()
    };

    const shouldAnimate = () => state.desktopQuery.matches && !state.reducedMotionQuery.matches;
    const getFrameSrc = (index) => `${config.frameBasePath}${frameFiles[index]}`;

    const hideCanvas = () => {
        canvas.classList.add('is-hidden');
        poster.classList.remove('is-hidden');
    };

    const showCanvas = () => {
        canvas.classList.remove('is-hidden');
        poster.classList.add('is-hidden');
    };

    const drawFrame = (img) => {
        if (!img || !img.complete || img.naturalWidth === 0) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const cssWidth = Math.max(1, Math.round(rect.width));
        const cssHeight = Math.max(1, Math.round(rect.height));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const renderWidth = Math.max(1, Math.round(cssWidth * dpr));
        const renderHeight = Math.max(1, Math.round(cssHeight * dpr));

        if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
            canvas.width = renderWidth;
            canvas.height = renderHeight;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, cssWidth, cssHeight);

        const widthRatio = cssWidth / img.naturalWidth;
        const heightRatio = cssHeight / img.naturalHeight;
        const ratio = Math.max(widthRatio, heightRatio);
        const drawWidth = img.naturalWidth * ratio;
        const drawHeight = img.naturalHeight * ratio;
        const offsetX = (cssWidth - drawWidth) / 2;
        const offsetY = (cssHeight - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        showCanvas();
    };

    const getFrame = (index) => {
        if (state.frames.has(index)) {
            return state.frames.get(index);
        }

        const img = new Image();
        img.decoding = 'async';
        img.src = getFrameSrc(index);
        state.frames.set(index, img);

        img.addEventListener('load', () => {
            if (index === 0) {
                state.initialFrameLoaded = true;
                drawFrame(img);
            }

            if (!state.interactiveReady && index < config.initialBatchSize) {
                const readyFrames = Array.from({ length: config.initialBatchSize }, (_, frameIndex) => frameIndex)
                    .filter((frameIndex) => state.frames.get(frameIndex)?.complete)
                    .length;

                if (readyFrames >= Math.min(6, config.initialBatchSize)) {
                    state.interactiveReady = true;
                    renderForCurrentMode();
                }
            } else if (index === state.currentFrameIndex) {
                drawFrame(img);
            }
        }, { once: true });

        return img;
    };

    const preloadFrames = (startIndex, endIndex) => {
        const boundedStart = Math.max(0, startIndex);
        const boundedEnd = Math.min(frameFiles.length - 1, endIndex);

        for (let index = boundedStart; index <= boundedEnd; index += 1) {
            getFrame(index);
        }

        state.highestRequestedIndex = Math.max(state.highestRequestedIndex, boundedEnd);
    };

    const getScrollFrameIndex = () => {
        const rect = heroSection.getBoundingClientRect();
        const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
        const scrolledDistance = Math.min(scrollableDistance, Math.max(0, -rect.top));
        const scrollFraction = scrolledDistance / scrollableDistance;

        return Math.max(0, Math.min(frameFiles.length - 1, Math.round(scrollFraction * (frameFiles.length - 1))));
    };

    const ensureFutureFrames = (targetIndex) => {
        if (!shouldAnimate()) {
            return;
        }

        if (targetIndex + config.batchSize > state.highestRequestedIndex) {
            preloadFrames(targetIndex, targetIndex + config.batchSize);
        }
    };

    const renderFrame = (targetIndex) => {
        state.currentFrameIndex = targetIndex;

        const targetImage = getFrame(targetIndex);

        if (targetImage?.complete) {
            drawFrame(targetImage);
        } else {
            const fallbackImage = state.frames.get(Math.max(0, targetIndex - 1)) || state.frames.get(0);

            if (fallbackImage?.complete) {
                drawFrame(fallbackImage);
            } else {
                hideCanvas();
            }
        }

        ensureFutureFrames(targetIndex);
    };

    const renderForCurrentMode = () => {
        if (!state.initialFrameLoaded || !shouldAnimate()) {
            hideCanvas();
            return;
        }

        if (!state.interactiveReady) {
            const firstFrame = state.frames.get(0);

            if (firstFrame?.complete) {
                drawFrame(firstFrame);
            } else {
                hideCanvas();
            }

            return;
        }

        renderFrame(getScrollFrameIndex());
    };

    const onScroll = () => {
        if (!shouldAnimate() || !state.interactiveReady || state.isTicking) {
            return;
        }

        state.isTicking = true;
        window.requestAnimationFrame(() => {
            renderFrame(getScrollFrameIndex());
            state.isTicking = false;
        });
    };

    const startLoading = () => {
        if (state.hasStartedLoading || !shouldAnimate()) {
            renderForCurrentMode();
            return;
        }

        state.hasStartedLoading = true;
        preloadFrames(0, config.initialBatchSize - 1);
        renderForCurrentMode();
    };

    hideCanvas();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', renderForCurrentMode, { passive: true });
    state.reducedMotionQuery.addEventListener('change', startLoading);
    state.desktopQuery.addEventListener('change', startLoading);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                startLoading();
                observer.disconnect();
            }
        }, { rootMargin: config.rootMargin });

        observer.observe(heroSection);
    } else {
        startLoading();
    }

    getFrame(0);
    renderForCurrentMode();
});
