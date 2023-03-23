const apiRequest = async (url = '', optionsObj = null, errorMessage = null) => {
try {
    const response = await fetch(url, optionsObj);
    const data = await response.json();
    if(!response.ok) throw Error('Please Reload the App')
} catch (error) {
    errorMessage = error.message;
} finally{
    return errorMessage;
}
}

export default apiRequest;