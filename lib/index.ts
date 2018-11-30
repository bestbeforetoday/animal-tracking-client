// tslint:disable:no-console

import { Client } from "./Client";

const client = new Client();
client.run()
    .then(() => console.log("Done"))
    .catch(console.error);
