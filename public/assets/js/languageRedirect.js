function checkLanguage() {
    var language = window.navigator.userLanguage || window.navigator.language;
    
    for (var i = 0; i < languageData.length; i++) {
        var languageKey = languageData[i].languageKey;
        
        if (language.indexOf(languageKey) !== -1)
        {
            document.location.href = languageData[i].linkKey;
        }
    }
    
    document.location.href = languageData[0].linkKey;
}