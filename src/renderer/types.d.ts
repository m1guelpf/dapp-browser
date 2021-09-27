declare module 'eth-provider' {
	import { ExternalProvider } from '@ethersproject/providers'

	function constructor(provider: string): ExternalProvider & BarebonesProvider
	export = constructor

	type BarebonesProvider = {
		enable(): Promise<string>
	}
}
