/* eslint-disable import/first */
import './App.global.css'
import { Buffer } from 'buffer'
import { providers } from 'ethers'
import ethProvider from 'eth-provider'
import { RefreshIcon } from '@heroicons/react/solid'
import React, { FormEvent, useLayoutEffect, useMemo, useRef, useState } from 'react'

global.Buffer = Buffer

// We use require here to ensure Buffer gets loaded first
const contentHash = require('@ensdomains/content-hash')

const App = () => {
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const web3 = useMemo(() => {
		const provider = ethProvider('frame')
		provider.enable()

		return new providers.Web3Provider(provider)
	}, [])
	const [address, setAddress] = useState<string>('')
	const [pageContent, setPageContent] = useState<string>('')

	useLayoutEffect(() => {
		if (!web3) return // eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(window as any).web3 = web3.provider
	}, [web3])

	const getUrl = (codec: string, cid: string) => {
		switch (codec) {
			case 'ipfs-ns':
				return `https://dweb.link/ipfs/${cid}/`
			case 'ipns-ns':
				return `https://dweb.link/ipns/${cid}/`
			case 'arweave-ns':
				return `https://areave.net/${cid}/`

			default:
				throw new Error('Protocol not found.')
		}
	}

	const navigate = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const ensHash = await web3
				.getResolver(address)
				// eslint-disable-next-line no-underscore-dangle
				.then(resolver => resolver._fetchBytes('0xbc1c58d1'))

			const url = getUrl(contentHash.getCodec(ensHash), contentHash.decode(ensHash))

			setPageContent(`<base href="${url}">${await fetch(url).then(res => res.text())}<script>window.ethereum = window.parent.web3</script>`)
		} catch {
			// eslint-disable-next-line no-alert
			alert('404 Not Found')
		}
	}

	const reloadPage = () => iframeRef.current?.contentWindow?.location.reload()

	return (
		<div className="flex flex-col min-h-screen">
			<form onSubmit={navigate} className="bg-white w-full flex items-center px-4 py-2 space-x-4 shadow">
				<div className="flex items-center">
					<button type="button" onClick={reloadPage} className="hover:bg-gray-100 p-1 rounded-lg">
						<RefreshIcon className="w-4 h-4" />
					</button>
				</div>
				{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
				<input pattern="(.*)\.eth" className="flex-1 -my-2 !-mr-4 py-1 focus:outline-none" placeholder="ENS Address" value={address} onChange={event => setAddress(event.target.value)} autoFocus required />
			</form>
			<iframe ref={iframeRef} className={pageContent ? 'flex-1' : 'hidden'} title={address} srcDoc={pageContent} />
			{!pageContent && (
				<div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-r from-indigo-400 to-purple-400">
					<h1 className="text-7xl font-black text-purple-100 tracking-wider text-center max-w-2xl leading-tight">Enter an ENS to navigate</h1>
				</div>
			)}
		</div>
	)
}

export default App
