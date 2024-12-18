function SettingsCheckbox()
{
    this.id = "";
    this.value = false;
    this.element;

    this.setup = function(parent, labelText, id, value)
    {
        this.id = id;
        this.value = value;
        this.element = this.buildElement(parent, labelText, id, value)
        this.element.addEventListener('change', this, true);
    }

    this.buildElement = function(parent, labelText, id, value)
    {
        let button = document.createElement("button");
        button.className = "overview-button"; 

        let textContent = document.createTextNode(labelText);

        let label = document.createElement("label");
        label.className = "overview-switch"; 

        let input = document.createElement("input");
        input.type = "checkbox";
        input.id = id;
        input.checked = value;

        let span = document.createElement("span");
        span.className = "overview-slider round";

        label.appendChild(input);
        label.appendChild(span);

        button.appendChild(textContent);
        button.appendChild(label);

        parent.appendChild(button);

        return input;
    }

    SettingsCheckbox.prototype.handleEvent = function(event) 
    {
        if (event.type === "change")
        {
            this.value = this.element.checked;
        }
    }
}