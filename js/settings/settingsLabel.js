function SettingsLabel()
{
    this.setup = function(parent, value)
    {
        this.buildElement(parent, value)
    }

    this.buildElement = function(parent, value)
    {
        let textContent = document.createTextNode(value);

        let label = document.createElement("div");
        label.className = "overview-setting-label";

        label.appendChild(textContent);
        parent.appendChild(label);
    }

    this.setupWithLink = function(parent, prefix, linkText, linkUrl, postfix)
    {
        this.buildElementWithLink(parent, prefix, linkText, linkUrl, postfix)
    }

    this.buildElementWithLink = function(parent, prefix, linkText, linkUrl, postfix)
    {
        let label = document.createElement("div");
        label.className = "overview-setting-label";

        let contentPrefix = document.createTextNode(prefix);
        label.appendChild(contentPrefix);

        var contentLink = document.createElement('a');
        contentLink.className = "overview-setting-label-link"
        contentLink.setAttribute('target', '_blank');
        var contentLinkText = document.createTextNode(linkText);
        contentLink.setAttribute('href', linkUrl);
        contentLink.appendChild(contentLinkText);
        label.appendChild(contentLink);

        let contentPostfix = document.createTextNode(postfix);
        label.appendChild(contentPostfix);

        parent.appendChild(label);
    }
}