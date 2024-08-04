
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('trail-toggle');
        const trailContainer = document.getElementById('trail-container');
            let trailEnabled = false;

                function createTrailElement(x, y) {
                        const trailElement = document.createElement('div');
                                trailElement.className = 'trail';
                                        trailElement.style.left = `${x}px`;
                                                trailElement.style.top = `${y}px`;
                                                        trailContainer.appendChild(trailElement);
                                                                setTimeout(() => trailElement.remove(), 500); // Adjust duration as needed
                                                                    }

                                                                        document.addEventListener('mousemove', function (event) {
                                                                                if (trailEnabled) {
                                                                                            createTrailElement(event.clientX, event.clientY);
                                                                                                    }
                                                                                                        });

                                                                                                            toggle.addEventListener('change', function () {
                                                                                                                    trailEnabled = this.checked;
                                                                                                                            if (!trailEnabled) {
                                                                                                                                        // Remove all trail elements when disabled
                                                                                                                                                    trailContainer.innerHTML = '';
                                                                                                                                                            }
                                                                                                                                                                });
                                                                                                                                                                });
