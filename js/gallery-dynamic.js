document.addEventListener("DOMContentLoaded", async () => {
    const API_ENDPOINT = "http://127.0.0.1:5050/api/public/gallery"; 
    const $carousel = $('#gallery-carousel');
    const $grid = $('#gallery-grid-container');

    try {
        const res = await fetch(API_ENDPOINT);
        if (!res.ok) throw new Error("Failed to fetch gallery");
        const images = await res.json();
        
        // 1. CLEAN SLATE
        if ($carousel.data('owl.carousel')) {
            $carousel.trigger('destroy.owl.carousel');
            $carousel.find('.owl-stage-outer').children().unwrap();
            $carousel.removeClass("owl-center owl-loaded owl-text-select-on");
        }
        $carousel.empty();
        $grid.empty();

        if (images.length === 0) return;

        let carouselHTML = '';
        let gridHTML = '';

        images.forEach(img => {
            const imageUrl = img.image || 'images/bg_1.jpg';
            const title = img.title || 'Gallery Image';

            // Carousel Item
            carouselHTML += `
                <div class="item">
                    <div class="gallery-item-wrapper" style="margin: 10px;">
                        <a href="${imageUrl}" class="carousel-popup" title="${title}">
                            <div class="gallery-item rounded shadow-sm" 
                                 style="background-image: url('${imageUrl}'); height: 320px; background-size: cover; background-position: center; position: relative; overflow: hidden; transition: transform 0.3s;">
                                
                                <div class="overlay" style="background: rgba(0,0,0,0.3); position: absolute; top:0; left:0; right:0; bottom:0; opacity: 0; transition: opacity 0.3s;"></div>
                                
                                <div class="icon d-flex align-items-center justify-content-center" 
                                     style="position: absolute; top:0; left:0; width:100%; height:100%; opacity: 0; transition: all 0.3s; transform: scale(0.8);">
                                    <span class="fa fa-expand text-white" style="font-size: 2rem;"></span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;

            // Grid Item
            gridHTML += `
                <div class="col-md-3 col-6 p-2">
                    <a href="${imageUrl}" class="grid-popup" title="${title}">
                        <div class="rounded shadow-sm border" 
                             style="background-image: url('${imageUrl}'); height: 180px; background-size: cover; background-position: center; cursor: pointer; transition: 0.2s;">
                        </div>
                    </a>
                </div>
            `;
        });

        $carousel.html(carouselHTML);
        $grid.html(gridHTML);

        // 2. INITIALIZE CAROUSEL (Standard Mode)
        // We turn OFF the library's autoplay because we will do it ourselves
        $carousel.owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            dots: true,
            autoplay: false, //  DISABLED (We handle it manually)
            smartSpeed: 800,
            items: 3,
            responsive: { 
                0: { items: 1 }, 
                600: { items: 2 }, 
                1000: { items: 3 } 
            }
        });

        // 🟢 3. THE BRUTE FORCE FIX (Manual Heartbeat)
        // This simulates a user clicking "Next" every 3.5 seconds
        setInterval(() => {
            $carousel.trigger('next.owl.carousel', [800]);
        }, 3500);

        // 4. LIGHTBOX CONFIG
        
        // Grid Popup (View Full Gallery)
        $('.grid-popup').magnificPopup({
            type: 'image',
            gallery: { enabled: true, navigateByImgClick: true, preload: [0,1] },
            mainClass: 'mfp-fade',
            fixedContentPos: true, 
            image: {
                titleSrc: function(item) {
                    return item.el.attr('title') + '<small>Collection</small>';
                }
            }
        });

        // Carousel Popup (Zoom only, no gallery mode to avoid duplicates)
        $('.carousel-popup').magnificPopup({
            type: 'image',
            gallery: { enabled: false }, // Disable arrows inside popup
            mainClass: 'mfp-fade',
            removalDelay: 300,
            image: {
                titleSrc: function(item) {
                    return item.el.attr('title');
                }
            }
        });

        // 5. HOVER EFFECTS
        $('.gallery-item-wrapper').hover(
            function() { 
                $(this).find('.overlay').css('opacity', 1); 
                $(this).find('.icon').css({'opacity': 1, 'transform': 'scale(1)'}); 
            },
            function() { 
                $(this).find('.overlay').css('opacity', 0); 
                $(this).find('.icon').css({'opacity': 0, 'transform': 'scale(0.8)'}); 
            }
        );

    } catch (err) {
        console.error("Gallery Error:", err);
    }
});