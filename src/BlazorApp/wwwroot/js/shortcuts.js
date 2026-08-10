window.appShortcuts = {
    init: function (dotNetRef) {
        document.addEventListener('keydown', function (e) {
            // Ignore when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
            if (e.target.isContentEditable) return;

            // Ctrl+N or Alt+N → New order
            if ((e.ctrlKey || e.altKey) && e.key === 'n') {
                e.preventDefault();
                window.location.href = '/narudzbe/nova';
            }
            // / → Focus search (if visible)
            if (e.key === '/' && !e.ctrlKey && !e.altKey) {
                var searchInput = document.querySelector('.filter-bar input[type="text"], .filter-bar .mud-input-slot input');
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });
    }
};
