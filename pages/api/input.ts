//ts-nocheck
// import { Message, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { kv } from "@vercel/kv";
import type { NextApiRequest, NextApiResponse } from "next";

const buttons = ['up', 'down', 'left', 'right', 'square', 'circle', 'triangle', 'x']
const mapping = {
   "up" : "u",
   "down" : "d",
   "left" : "l",
   "right" : "r",
   "square" : "s",
   "circle" : "c",
   "triangle" : "t",
   "x" : "x",
};

function getNextInput(page: number, buttonId: 2 | 3) {
	let nextInput = ''
	if (page == 2) {
		nextInput = buttonId == 2 ? 'u' : 'd'
	}
	else if (page == 3) {
		nextInput = buttonId == 2 ? 'l' : 'r'

	}
	else if (page == 4) {
		nextInput = buttonId == 2 ? 's' : 'c'

	}
	else if (page == 5) {
		nextInput = buttonId == 2 ? 't' : 'x'
	}

	return nextInput;
}


function getUsedButtons(page: number) {
	let usedButtons;
				switch (page) {
					case 1:
						console.log("I am here")
						usedButtons = [buttons[0], buttons[1]]
						break
					case 2:
						console.log("I am here")
						usedButtons = [buttons[2], buttons[3]]
						break
					case 3:
						console.log("I am here")
						usedButtons = [buttons[4], buttons[5]]
						break
					case 4:
						console.log("I am here")
						usedButtons = [buttons[6], buttons[7]]
						break
	}
	return usedButtons
			}
function getAltUsedButtons(page: number) {
	let usedButtons;
				switch (page) {
					case 2:
						console.log("I am here")
						usedButtons = [buttons[0], buttons[1]]
						break
					case 3:
						console.log("I am here")
						usedButtons = [buttons[2], buttons[3]]
						break
					case 4:
						console.log("I am here")
						usedButtons = [buttons[4], buttons[5]]
						break
					case 5:
						console.log("I am here")
						usedButtons = [buttons[6], buttons[7]]
						break
	}
	return usedButtons
			}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
		try {

			let buttonId = req.body.untrustedData.buttonIndex || 2;
			console.log({buttonId})
			let currentPage = req.query.page as unknown as number
			console.log({currentPage})

			if(+currentPage == 7){
	const imageUrl = `${process.env['HOST']}/api/image?input=`
  	const postUrl = `${process.env["HOST"]}/api/input?page=2&input=`

				return  res.status(200).send(`
      			<!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <meta property="og:title" content="Final Image">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame:post_url" content="${postUrl}" />
			<meta name="fc:frame:button:1" content="->" />
			<meta name="fc:frame:button:2" content="up" />
			<meta name="fc:frame:button:3" content="down" />
			<meta name="fc:frame:button:4" content="Clear" />
        </head>
        <body>

        </body>
      </html>
    `);
			}
			let nextPage = +currentPage
			


			let input = req.query.input as unknown as string ?? ''
			console.log({ input })
			console.log({ buttonId })

			let nextInput
			if (buttonId == 2 || buttonId == 3) {
				const temp = getNextInput(currentPage, buttonId) ?? ''
				nextInput = input.length == 0 ?  temp : input + temp
			}
			else if (buttonId == 1) {
				nextInput = input ?? ''
			}
			else {
				nextInput = ''
			}
			console.log({nextInput})
			console.log({nextInput})

			if (buttonId == 1) {
				nextPage = +currentPage + 1;
				nextInput = input
      }


			let buttonsTemplate = ''

			if (currentPage > 5 && buttonId == 2) {
				//End of page. Fetch result
        const key = `ipfs_file:${input}`;
        const ipfsCID = await kv.get(key);
				let finalImageUrl: string;
				console.log({ ipfsCID });

        if (ipfsCID) {
          finalImageUrl = process.env.PINATA_GATEWAY + "/ipfs/" + ipfsCID;
        }
				else {
					finalImageUrl = `${process.env['HOST']}/api/finalImage`
				}
				const postUrl = `${process.env["HOST"]}/api/input?page=7`;

				res.setHeader("Content-Type", "text/html");
return  res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <meta property="og:title" content="Final Image">
          <meta property="og:image" content="${finalImageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${finalImageUrl}">
          <meta name="fc:frame:post_url" content="${postUrl}" />
			<meta name="fc:frame:button:1" content="Fetch Another" />
        </head>
        <body>

        </body>
      </html>
    `);
			}

			if (currentPage > 5) {
        currentPage = 1;
        nextPage = 2;
      }
	  let usedButtons: string[] = [];
	  if(buttonId == 2 || buttonId == 3 || buttonId == 4){
		  usedButtons = getAltUsedButtons(+currentPage) ?? []
	  }
	  else usedButtons = getUsedButtons(+currentPage) ?? []

			console.log(usedButtons)




				if (currentPage == 5 && nextPage == 6) {
					buttonsTemplate =
						`
					<meta name="fc:frame:button:1" content="->">
          <meta name="fc:frame:button:2" content="Fetch">
				`;
				}
				else {
					buttonsTemplate =
						`<meta name="fc:frame:button:1" content="->">
          ${usedButtons.map((button, index) => {
							return `
						<meta name="fc:frame:button:${index + 2}" content="${button}">`
						})}
					<meta name="fc:frame:button:4" content="Clear">
					`
				}

			if (buttonId == 4) {
				nextInput = ""
			}
			if (buttonId == 1) {
				nextInput = input ?? ''
			}



const imageUrl = `${process.env['HOST']}/api/image?input=${nextInput}`
const postUrl = `${process.env["HOST"]}/api/input?page=${nextPage}&input=${nextInput}`;

console.log({ nextInput, nextPage, currentPage})

				res.setHeader("Content-Type", "text/html");
				res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <meta property="og:title" content="">
          <meta property="og:image" content="$">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content=${imageUrl}>
          <meta name="fc:frame:post_url" content="${postUrl}">
					${buttonsTemplate}
        </head>
        <body>

        </body>
      </html>
    `);
			}
		catch (error) {
      console.error(error);
      res.status(500).send("Error generating image");
    }
} else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
