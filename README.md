# persona_helper

This is an experimental Chrome Extension which will allow users of CAIRIS to add factoids based on online sources.  These can be used as the basis for specifying persona characteristics in CAIRIS.  

To use, simply:

* highlight text on a web page that forms the basis of the factoid.
* Click on the extension button.  You will be asked to specify a factoid summarising the evidence highlighted
* Clicking on 'Ok' will add a new *Document Reference* to CAIRIS representing the factoid.

Notes when using this extension:

* The extension relies on the 'test' session that comes with default CAIRIS installation.  Later versions will support authentication with CAIRIS, so only legitimate users can add factoids
* The extension relies on local storage for setting detail of the CAIRIS URL, author and contributor details.  These currently can't be changed when first defined.  Later versions will allow these details to be reset.
