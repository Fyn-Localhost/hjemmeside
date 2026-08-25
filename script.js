document.addEventListener('DOMContentLoaded', () => {

    // 1. SIDESKIFT LOGIK
    const navButtons = document.querySelectorAll('.nav-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    const pageSections = document.querySelectorAll('.page-section');

    function switchPage(pageId) {
        pageSections.forEach(section => section.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));

        const activeSection = document.getElementById(pageId);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        const activeNavBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
        if (activeNavBtn) {
            activeNavBtn.classList.add('active');
        }

        if (pageId === 'portfolio') {
            const firstInputBtn = document.querySelector('.category-toggle');
            if (firstInputBtn && !firstInputBtn.classList.contains('active')) {
                firstInputBtn.click();
            }
        }

        window.scrollTo(0, 0);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => switchPage(button.getAttribute('data-page')));
    });

    actionButtons.forEach(button => {
        button.addEventListener('click', () => switchPage(button.getAttribute('data-page')));
    });

    // 2. PORTFOLIO KATEGORIER
    const categoryButtons = document.querySelectorAll('.category-toggle');
    const categoryContents = document.querySelectorAll('.category-content');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetCategory = document.getElementById(targetId);

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            categoryContents.forEach(content => content.style.display = 'none');

            button.classList.add('active');
            targetCategory.style.display = 'block';
        });
    });

    // 3. MUSIKAFSPILER
    const playButtons = document.querySelectorAll('.play-btn');
    let currentAudio = null;
    let currentButton = null;

    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const trackPath = e.target.getAttribute('data-track');
            
            if (currentAudio && currentButton === e.target) {
                currentAudio.pause();
                currentAudio = null;
                currentButton = null;
                e.target.innerText = "Afspil Demo";
                return;
            }

            if (currentAudio) {
                currentAudio.pause();
                currentButton.innerText = "Afspil Demo";
            }

            currentAudio = new Audio(trackPath);
            currentButton = e.target;

            currentAudio.play()
                .then(() => {
                    e.target.innerText = "Stopper...";
                })
                .catch(error => {
                    console.error("Lydfejl:", error);
                    alert("Kunne ikke afspille lyden. Tjek om lydfilen ligger i din audio/ mappe.");
                });

            currentAudio.addEventListener('ended', () => {
                e.target.innerText = "Afspil Demo";
                currentAudio = null;
                currentButton = null;
            });
        });
    });

    // 4. DISCORD WEBHOOK INTEGRATION
    const orderForm = document.getElementById('orderForm');

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // INDSÆT DIN DISCORD WEBHOOK URL HER
        const discordWebhookUrl = "INDSÆT_DIN_DISCORD_WEBHOOK_URL_HER";

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const serviceSelect = document.getElementById('service');
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        const description = document.getElementById('description').value;

        const submitBtn = orderForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sender...";
        submitBtn.disabled = true;

        const logoUrl = window.location.origin + "/img/logo.png";

        const discordMessage = {
            username: "King Productions - Bot",
            avatar_url: logoUrl,
            embeds: [{
                title: "🎵 NY PROJEKTFORESPØRGSEL!",
                color: 16777215,
                fields: [
                    { name: "👤 Kunde / Artist:", value: name, inline: true },
                    { name: "📧 E-mail:", value: email, inline: true },
                    { name: "🎛️ Ydelse ønsket:", value: serviceText, inline: false },
                    { name: "📝 Projektbeskrivelse:", value: description, inline: false }
                ],
                footer: { text: "Modtaget via King Productions Mobil" },
                timestamp: new Date().toISOString()
            }]
        };

        fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordMessage)
        })
        .then(response => {
            if (response.ok) {
                alert(`Mange tak for din henvendelse, ${name}!\n\nVi sender et udspil til ${email} hurtigst muligt.`);
                orderForm.reset();
            } else {
                alert("Der skete en fejl. Tjek din webhook URL.");
            }
        })
        .catch(error => {
            alert("Kunne ikke oprette forbindelse. Prøv igen.");
        })
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });
});
