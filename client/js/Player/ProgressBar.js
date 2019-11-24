class ProgressBar 
{
    constructor(element, initalValue = 0, StringValueBar, StringFillBar)
    {
        this.valueElem = element.querySelector(StringValueBar);
        this.fillElem = element.querySelector(StringFillBar);

        this.setValue(initalValue);
    }

    setValue(newValue)
    {   
        if (newValue <= 0)
            newValue = 0;
        else if (newValue >= 100)
            newValue = 100

        this.value = newValue; 
        this.Update();
    }

    getValue()
    {
        return this.value;
    }

    Update()
    {
        // update changes in the document 
        const percentage = this.value + '%'; // 50 % or 60 % or 100 %
        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }
}