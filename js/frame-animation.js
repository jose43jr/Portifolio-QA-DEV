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

    const config = {
        initialBatchSize: 12,
        batchSize: 18,
        mobileBreakpoint: 768,
        rootMargin: '200px 0px',
        variants: [
            { frameCount: 72, path: 'frame-optimized/frame', extensions: ['avif', 'webp', 'png'] },
            { frameCount: 147, path: 'frame a frame/frame', extensions: ['avif', 'webp', 'png'] }
        ]
    };

    const state = {
        currentFrame: 1,
        highestRequestedFrame: 0,
        initialFrameLoaded: false,
        interactiveReady: false,
        isTicking: false,
        hasStartedLoading: false,
        activeSequence: null,
        reducedMotionQuery: window.matchMedia('(prefers-reduced-motion: reduce)'),
        desktopQuery: window.matchMedia(`(min-width: ${config.mobileBreakpoint + 1}px)`),
        frames: new Map()
    };

    const shouldAnimate = () => state.desktopQuery.matches && !state.reducedMotionQuery.matches;

    const hideCanvas = () => {
        canvas.classList.add('is-hidden');
        poster.classList.remove('is-hidden');
    };

    const showCanvas = () => {
        canvas.classList.remove('is-hidden');
        poster.classList.add('is-hidden');
    };

    const getFrameSrc = (frameNumber) => {
        if (!state.activeSequence) {
            return null;
        }

        const paddedIndex = String(frameNumber).padStart(5, '0');
        return `${state.activeSequence.path}${paddedIndex}.${state.activeSequence.extension}`;
    };

    const loadProbeImage = (src) => new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';

        img.addEventListener('load', () => resolve(img), { once: true });
        img.addEventListener('error', () => resolve(null), { once: true });
        img.src = src;
    });

    const resolveActiveSequence = async () => {
        if (state.activeSequence) {
            return state.activeSequence;
        }

        for (const variant of config.variants) {
            for (const extension of variant.extensions) {
                const probeSrc = `${variant.path}${String(1).padStart(5, '0')}.${extension}`;
                const probeImage = await loadProbeImage(probeSrc);

                if (probeImage) {
                    state.activeSequence = { ...variant, extension };
                    state.frames.set(1, probeImage);
                    poster.src = probeSrc;
                    return state.activeSequence;
                }
            }
        }

        return null;
    };

    const getFrame = (frameNumber) => {
        if (state.frames.has(frameNumber)) {
            return state.frames.get(frameNumber);
        }

        const frameSrc = getFrameSrc(frameNumber);

        if (!frameSrc) {
            return null;
        }

        const img = new Image();
        img.decoding = 'async';
        img.loading = 'eager';
        img.src = frameSrc;
        state.frames.set(frameNumber, img);

        img.addEventListener('load', () => {
            if (frameNumber === 1) {
                state.initialFrameLoaded = true;
                drawFrame(img);
            }

            if (!state.interactiveReady && frameNumber <= config.initialBatchSize) {
                const readyFrames = Array.from({ length: config.initialBatchSize }, (_, index) => index + 1)
                    .filter((index) => state.frames.get(index)?.complete).length;

                if (readyFrames >= Math.min(8, config.initialBatchSize)) {
                    state.interactiveReady = true;
                    renderForCurrentMode();
                }
            } else if (frameNumber === state.currentFrame) {
                drawFrame(img);
            }
        }, { once: true });

        return img;
    };

    const preloadFrames = (start, end) => {
        if (!state.activeSequence) {
            return;
        }

        const boundedStart = Math.max(1, start);
        const boundedEnd = Math.min(state.activeSequence.frameCount, end);

        for (let frameNumber = boundedStart; frameNumber <= boundedEnd; frameNumber += 1) {
            getFrame(frameNumber);
        }

        state.highestRequestedFrame = Math.max(state.highestRequestedFrame, boundedEnd);
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

    const getScrollFrame = () => {
        const rect = heroSection.getBoundingClientRect();
        const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
        const scrolledDistance = Math.min(scrollableDistance, Math.max(0, -rect.top));
        const scrollFraction = scrolledDistance / scrollableDistance;

        return Math.max(
            1,
            Math.min(
                state.activeSequence?.frameCount || 1,
                Math.round(scrollFraction * ((state.activeSequence?.frameCount || 1) - 1)) + 1
            )
        );
    };

    const ensureFutureFrames = (targetFrame) => {
        if (!shouldAnimate() || !state.activeSequence) {
            return;
        }

        if (targetFrame + config.batchSize > state.highestRequestedFrame) {
            preloadFrames(targetFrame, targetFrame + config.batchSize);
        }
    };

    const renderFrame = (targetFrame) => {
        state.currentFrame = targetFrame;

        const targetImage = getFrame(targetFrame);

        if (targetImage?.complete) {
            drawFrame(targetImage);
        } else {
            const fallbackFrame = Math.max(1, targetFrame - 1);
            const fallbackImage = state.frames.get(fallbackFrame) || state.frames.get(1);

            if (fallbackImage?.complete) {
                drawFrame(fallbackImage);
            } else {
                hideCanvas();
            }
        }

        ensureFutureFrames(targetFrame);
    };

    const renderForCurrentMode = () => {
        if (!state.initialFrameLoaded) {
            hideCanvas();
            return;
        }

        if (!shouldAnimate()) {
            hideCanvas();
            return;
        }

        if (!state.interactiveReady) {
            const firstFrame = state.frames.get(1);

            if (firstFrame?.complete) {
                drawFrame(firstFrame);
            } else {
                hideCanvas();
            }

            return;
        }

        renderFrame(getScrollFrame());
    };

    const onScroll = () => {
        if (!shouldAnimate() || !state.interactiveReady || state.isTicking) {
            return;
        }

        state.isTicking = true;
        window.requestAnimationFrame(() => {
            renderFrame(getScrollFrame());
            state.isTicking = false;
        });
    };

    const onResize = () => {
        renderForCurrentMode();
    };

    const startLoading = async () => {
        if (state.hasStartedLoading || !shouldAnimate()) {
            renderForCurrentMode();
            return;
        }

        state.hasStartedLoading = true;

        const sequence = await resolveActiveSequence();

        if (!sequence) {
            hideCanvas();
            return;
        }

        const firstFrame = state.frames.get(1) || getFrame(1);

        if (firstFrame?.complete) {
            state.initialFrameLoaded = true;
            drawFrame(firstFrame);
        }

        preloadFrames(1, config.initialBatchSize);
        renderForCurrentMode();
    };

    hideCanvas();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
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

    renderForCurrentMode();
});
