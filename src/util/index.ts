export const base64 = (file: any, callback: (dataUrl: string) => void) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    const dataUrl = e.target?.result as string
    callback(dataUrl)
  }
}
