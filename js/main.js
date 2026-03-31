(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        margin: 30,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Related Post carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        margin: 30,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    // Pricing tabs
    $('.pricing-segment-tab').on('click', function () {
        var target = $(this).data('pricing-target');

        $('.pricing-segment-tab').removeClass('active');
        $(this).addClass('active');

        $('.pricing-panel').removeClass('active');
        $('.pricing-panel[data-pricing-panel="' + target + '"]').addClass('active');
    });

    // Creator pricing calculator
    var creatorNetworkWeights = {
        instagram: 1.35,
        tiktok: 1.30,
        youtube: 1.20,
        whatsapp: 1.20,
        linkedin: 1.10,
        x: 1.00
    };

    var creatorNetworkNames = {
        instagram: 'Instagram',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        whatsapp: 'WhatsApp',
        linkedin: 'LinkedIn',
        x: 'X / Twitter'
    };

    var creatorFollowerTiers = {
        nano: {
            label: 'hasta 10.000 seguidores',
            multiplier: 1.00
        },
        growth: {
            label: 'entre 10.000 y 50.000 seguidores',
            multiplier: 1.35
        },
        pro: {
            label: 'entre 50.000 y 250.000 seguidores',
            multiplier: 1.80
        },
        major: {
            label: 'entre 250.000 y 1.000.000 de seguidores',
            multiplier: 2.50
        },
        elite: {
            label: 'mas de 1.000.000 de seguidores',
            multiplier: 3.40
        }
    };

    function roundToStep(value, step) {
        return Math.max(step, Math.round(value / step) * step);
    }

    function formatEuro(value) {
        return value.toLocaleString('es-ES') + ' &euro;';
    }

    function formatEuroText(value) {
        return value.toLocaleString('es-ES') + ' EUR';
    }

    function formatNetworkList(networks) {
        return $.map(networks, function (network) {
            return creatorNetworkNames[network] || network;
        }).join(', ');
    }

    function updateCreatorPricing() {
        var selectedNetworks = $('.creator-network-input:checked').map(function () {
            return this.value;
        }).get();
        var selectedTierKey = $('#creatorFollowers').val();
        var selectedTier = creatorFollowerTiers[selectedTierKey] || creatorFollowerTiers.nano;
        var networkWeight = 0;
        var networkLabel = '';
        var setupPrice;
        var monthlyPrice;
        var recoveryPrice;
        var rawSetupPrice;
        var rawMonthlyPrice;
        var rawRecoveryPrice;
        var networkSummary;
        var floorMessage = '';

        if (!selectedNetworks.length) {
            networkWeight = 1;
            networkLabel = 'una red principal';
            networkSummary = 'Instagram';
        } else {
            $.each(selectedNetworks, function (_, network) {
                networkWeight += creatorNetworkWeights[network] || 1;
            });
            networkLabel = selectedNetworks.length === 1 ? '1 red seleccionada' : selectedNetworks.length + ' redes seleccionadas';
            networkSummary = formatNetworkList(selectedNetworks);
        }

        rawSetupPrice = roundToStep(120 * networkWeight * selectedTier.multiplier, 5);
        rawMonthlyPrice = roundToStep(37 * networkWeight * selectedTier.multiplier, 5);
        rawRecoveryPrice = roundToStep(800 * networkWeight * selectedTier.multiplier, 10);

        setupPrice = Math.max(145, rawSetupPrice);
        monthlyPrice = Math.max(45, rawMonthlyPrice);
        recoveryPrice = Math.max(800, rawRecoveryPrice);

        if (rawSetupPrice < 145 || rawMonthlyPrice < 45 || rawRecoveryPrice < 800) {
            floorMessage = ' Con los minimos definidos, algunas redes pueden compartir el mismo precio final en tramos bajos.';
        }

        $('#creatorSetupPrice').html(formatEuro(setupPrice) + '<span>/ pago unico</span>');
        $('#creatorMonthlyPrice').html(formatEuro(monthlyPrice) + '<span>/ mes</span>');
        $('#creatorRecoveryPrice').html(formatEuro(recoveryPrice) + '<span>/ incidente</span>');

        $('#creatorPricingSummary').text(
            'Estimacion para ' + networkLabel + ' y un perfil con ' + selectedTier.label + '. A mayor exposicion, mayor esfuerzo de configuracion, seguimiento y respuesta.' + floorMessage
        );
        $('#creatorSetupNote').text(
            'Incluye hardening, orden de accesos y configuracion inicial segun las redes que hayas marcado.'
        );
        $('#creatorMonthlyNote').text(
            'Calculado con monitorizacion, alertas, backups y mantenimiento continuo. Requiere configuracion inicial.'
        );
        $('#creatorRecoveryNote').text(
            'La recuperacion depende del alcance y la criticidad de la cuenta. Requiere configuracion inicial.'
        );

        $('.creator-contact-link[data-service="setup"]').attr(
            'href',
            'contact.html?segment=creadores&service=setup&price=' + encodeURIComponent(formatEuroText(setupPrice)) + '&period=pago%20unico&followers=' + encodeURIComponent(selectedTier.label) + '&networks=' + encodeURIComponent(networkSummary)
        );
        $('.creator-contact-link[data-service="mantenimiento"]').attr(
            'href',
            'contact.html?segment=creadores&service=mantenimiento&price=' + encodeURIComponent(formatEuroText(monthlyPrice)) + '&period=mes&followers=' + encodeURIComponent(selectedTier.label) + '&networks=' + encodeURIComponent(networkSummary) + '&requires_setup=si'
        );
        $('.creator-contact-link[data-service="recuperacion"]').attr(
            'href',
            'contact.html?segment=creadores&service=recuperacion&price=' + encodeURIComponent(formatEuroText(recoveryPrice)) + '&period=incidente&followers=' + encodeURIComponent(selectedTier.label) + '&networks=' + encodeURIComponent(networkSummary) + '&requires_setup=si'
        );
    }

    function updateBusinessPricing(segment) {
        var selectedNetworks = $('.business-network-input[data-business-segment="' + segment + '"]:checked').map(function () {
            return this.value;
        }).get();
        var selectedTierKey = $('.business-followers-select[data-business-segment="' + segment + '"]').val();
        var selectedTier = creatorFollowerTiers[selectedTierKey] || creatorFollowerTiers.nano;
        var networkSummary = formatNetworkList(selectedNetworks);
        var helperId = segment === 'empresas' ? '#companyPricingSummary' : '#agencyPricingSummary';

        if (!networkSummary) {
            networkSummary = 'Instagram';
        }

        $(helperId).text(
            'Solicitud a medida para ' + networkSummary + ' y un perfil con ' + selectedTier.label + '. El equipo comercial ajustara el alcance segun criticidad, accesos y operativa.'
        );

        $('.pricing-contact-link[data-segment="' + segment + '"]').each(function () {
            var service = $(this).data('service');
            var period = $(this).data('period') || 'a medida';
            var requiresSetup = $(this).data('requires-setup');
            var href =
                'contact.html?segment=' + encodeURIComponent(segment) +
                '&service=' + encodeURIComponent(service) +
                '&product=' + encodeURIComponent(service) +
                '&price=' + encodeURIComponent('A medida') +
                '&period=' + encodeURIComponent(period) +
                '&followers=' + encodeURIComponent(selectedTier.label) +
                '&networks=' + encodeURIComponent(networkSummary);

            if (requiresSetup) {
                href += '&requires_setup=si';
            }

            $(this).attr('href', href);
        });
    }

    $('.creator-network-input').on('change', updateCreatorPricing);
    $('#creatorFollowers').on('change', updateCreatorPricing);
    updateCreatorPricing();

    $('.business-network-input').on('change', function () {
        updateBusinessPricing($(this).data('business-segment'));
    });
    $('.business-followers-select').on('change', function () {
        updateBusinessPricing($(this).data('business-segment'));
    });
    updateBusinessPricing('empresas');
    updateBusinessPricing('agencias');

    // Contact budget summary
    var contactBudgetCard = document.getElementById('contactBudgetCard');
    if (contactBudgetCard) {
        var contactParams = new URLSearchParams(window.location.search);
        var segment = contactParams.get('segment');
        var service = contactParams.get('service');
        var price = contactParams.get('price');
        var period = contactParams.get('period');
        var followers = contactParams.get('followers');
        var networks = contactParams.get('networks');
        var product = contactParams.get('product');
        var requiresSetup = contactParams.get('requires_setup');
        var iframe = document.querySelector('.contact-form-embed');

        if (segment || service || price) {
            var budgetText =
                'Segmento: ' + (segment || '-') + '\n' +
                'Producto: ' + (product || service || '-') + '\n' +
                'Precio: ' + (price || '-') + '\n' +
                'Modalidad: ' + (period || '-') + '\n' +
                'Redes: ' + (networks || '-') + '\n' +
                'Seguidores: ' + (followers || '-') + '\n' +
                'Requiere configuracion inicial: ' + (requiresSetup ? 'Si' : 'No');

            contactBudgetCard.hidden = false;
            $('#contactBudgetTitle').text('Tu estimacion para ' + (segment || 'tu cuenta'));
            $('#contactBudgetSegment').text(segment || '-');
            $('#contactBudgetService').text(product || service || '-');
            $('#contactBudgetPrice').text(price || '-');
            $('#contactBudgetPeriod').text(period || '-');
            $('#contactBudgetNote').text(
                'Presupuesto orientativo calculado desde planes. ' +
                (networks ? 'Redes: ' + networks + '. ' : '') +
                (followers ? 'Seguidores: ' + followers + '. ' : '') +
                (requiresSetup ? 'Este servicio requiere configuracion inicial. ' : '') +
                'Si nos escribes, afinamos el alcance contigo.'
            );

            if (iframe && iframe.dataset.baseSrc) {
                iframe.src = 'https://docs.google.com/forms/d/e/1FAIpQLSeYsfFoKC0K_6ON_bc7iuPO5HRndD-es0oaL2bMt7ouCeaTdg/viewform?usp=pp_url&entry.271351298=' + encodeURIComponent(budgetText) + '&embedded=true&budget_ts=' + Date.now();
            }
        }
    }
    
})(jQuery);
