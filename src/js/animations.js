function animateElement(element, animationClass, delay = 0) {
    setTimeout(() => {
        element.classList.add(animationClass);
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }, delay);
}

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.className = 'ripple';

    const rippleContainer = button.getElementsByClassName('ripple-container')[0] || button;
    rippleContainer.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Aplicar efeito ripple em todos os botões
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Aplicar hover effects
document.querySelectorAll('.track-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});