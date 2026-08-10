window.orderForm = {
    scrollToField: function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var input = el.querySelector('input, select, textarea');
        if (input) input.focus();
    },

    // Blokira (preventDefault) tastere koji ne odgovaraju dozvoljenom skupu
    // znakova — koristi se za striktno numerička polja (JMBG/Matični broj,
    // telefon) tako da se slova ne mogu unijeti ni privremeno.
    restrictToPattern: function (elementId, pattern) {
        var el = document.getElementById(elementId);
        if (!el) return;
        var input = el.querySelector('input');
        if (!input || input.dataset.restricted === pattern) return;
        input.dataset.restricted = pattern;

        var regex = new RegExp(pattern);
        input.addEventListener('keydown', function (e) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key.length !== 1) return; // Backspace, Delete, Tab, strelice...
            if (!regex.test(e.key)) e.preventDefault();
        });

        input.addEventListener('paste', function (e) {
            var text = (e.clipboardData || window.clipboardData).getData('text');
            if (!text) return;
            var allChars = new RegExp('^' + pattern + '*$');
            if (!allChars.test(text)) {
                e.preventDefault();
                var filtered = text.split('').filter(function (ch) { return regex.test(ch); }).join('');
                document.execCommand('insertText', false, filtered);
            }
        });
    }
};
