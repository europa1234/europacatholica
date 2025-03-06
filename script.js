(function() {
    function isScrollable(element) {
        return element.scrollWidth > element.clientWidth;
    }

    function isMobileDevice() {
        return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    function smoothScroll(element, target, duration) {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();
        const maxScroll = element.scrollWidth - element.clientWidth;
        const clampedTarget = Math.max(0, Math.min(target, maxScroll));
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress * progress * (3 - 2 * progress);
            element.scrollLeft = start + change * ease;
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    document.querySelectorAll('.table-container').forEach((container, index) => {
        if (isScrollable(container)) {
            const progressBar = document.getElementById(`progress${index + 1}`);
            function updateProgress() {
                const maxScroll = container.scrollWidth - container.clientWidth;
                const currentScroll = container.scrollLeft;
                const progressPercent = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
                progressBar.style.width = `${progressPercent}%`;
            }
            container.addEventListener('scroll', updateProgress);
            updateProgress();

            if (!isMobileDevice()) {
                let lastScrollDirection = 0;
                container.addEventListener('wheel', (event) => {
                    event.preventDefault();
                    const delta = event.deltaY;
                    const direction = delta > 0 ? 1 : -1;
                    if (lastScrollDirection !== direction) {
                        lastScrollDirection = direction;
                    }
                    const baseScrollAmount = Math.abs(delta) * 1.5;
                    const momentumFactor = 1.5;
                    const scrollAmount = baseScrollAmount * momentumFactor * direction;
                    const targetScroll = container.scrollLeft + scrollAmount;
                    const duration = 250;
                    smoothScroll(container, targetScroll, duration);
                }, { passive: false });
                container.addEventListener('scroll', updateProgress);
            }
        }
    });
})();
