const {SessionsClient} = require('@google-cloud/dialogflow-cx');

const projectId = 'connectbot-82010';
const location = 'global';
const agentId = '8376c021-2cfd-4da3-a6ef-f92c5b7ad255';
const languageCode = 'en';

const client = new SessionsClient({
    keyFilename: "./key.json"
});

const sessionId = Math.random().toString(36).substring(7);
const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
);
console.log(sessionPath);

const detectIntentText = async function detectIntentText(querytext, callback) {

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: querytext,
            },
            languageCode
        }
    };

    try {
        const [response] = await client.detectIntent(request);
        console.log(`User Query: ${querytext}`);
        if(!response){
            callback("Unable to fetch Intent data from dialogflow CX", undefined);
        } else {
            const data = {text: []};
            for (const message of response.queryResult.responseMessages) {
                if (message.text) {
                    for(const stringValue of message.text.text)
                    data.text.push(stringValue);
                    console.log(`Agent Response: ${data.text}`);
                }
            }
            //console.log("response.queryResult:", JSON.stringify(response.queryResult));
            if (response.queryResult.match) {
                data.matchedIntentOREvent = response.queryResult.match;
                if(response.queryResult.match.intent) {
                    console.log(
                        `Matched Intent: ${response.queryResult.match.intent.displayName}`
                    );
                }
                
            }
            data.currentPage = response.queryResult.currentPage;
            console.log(
                `Current Page: ${response.queryResult.currentPage.displayName}`
            );
            callback(undefined, data);
        }
    } catch (error) {
        callback(error, undefined);
    }
    
}

module.exports = detectIntentText;

