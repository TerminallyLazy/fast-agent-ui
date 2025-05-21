"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  FolderOpen, 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  Search,
  Filter,
  Image as ImageIcon,
  FileCode,
  FilePdf,
  FileSpreadsheet,
  FileArchive,
  File
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  date: string
  tags: string[]
  content?: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "data_analysis.csv",
      type: "csv",
      size: "2.4 MB",
      date: "2023-06-15",
      tags: ["data", "analysis"],
      content: "id,name,value\n1,Item 1,100\n2,Item 2,200\n3,Item 3,300"
    },
    {
      id: "2",
      name: "report.pdf",
      type: "pdf",
      size: "1.2 MB",
      date: "2023-06-14",
      tags: ["report", "document"]
    },
    {
      id: "3",
      name: "image.png",
      type: "image",
      size: "3.5 MB",
      date: "2023-06-12",
      tags: ["image"]
    },
    {
      id: "4",
      name: "code_sample.py",
      type: "code",
      size: "12 KB",
      date: "2023-06-10",
      tags: ["code", "python"],
      content: "def hello_world():\n    print('Hello, world!')\n\nif __name__ == '__main__':\n    hello_world()"
    },
    {
      id: "5",
      name: "presentation.pptx",
      type: "presentation",
      size: "5.7 MB",
      date: "2023-06-08",
      tags: ["presentation", "slides"]
    },
    {
      id: "6",
      name: "archive.zip",
      type: "archive",
      size: "10.2 MB",
      date: "2023-06-05",
      tags: ["archive", "compressed"]
    }
  ])
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileItem[] = Array.from(e.target.files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: formatFileSize(file.size),
        date: new Date().toISOString().split('T')[0],
        tags: [file.type.split('/')[0]]
      }))
      
      setFiles(prev => [...prev, ...newFiles])
    }
  }
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <ImageIcon className="h-5 w-5" />
      case 'pdf':
        return <FilePdf className="h-5 w-5" />
      case 'csv':
      case 'xlsx':
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5" />
      case 'code':
      case 'py':
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
        return <FileCode className="h-5 w-5" />
      case 'zip':
      case 'archive':
        return <FileArchive className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }
  
  const deleteFile = () => {
    if (selectedFile) {
      setFiles(prev => prev.filter(file => file.id !== selectedFile.id))
      setSelectedFile(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const downloadFile = (file: FileItem) => {
    // Create a blob with the file content or a placeholder if no content
    const content = file.content || `This is a placeholder for ${file.name}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Files</h1>
            <p className="text-muted-foreground">Manage your files and resources</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
                multiple 
              />
            </Button>
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Browse
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSearchQuery("")}>
                All Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("image")}>
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("document")}>
                Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("code")}>
                Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("data")}>
                Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-base">
                    {getFileIcon(file.type)}
                    <span className="ml-2 truncate">{file.name}</span>
                  </CardTitle>
                </div>
                <CardDescription>
                  {file.size} • {file.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {file.type}
                  </Badge>
                  {file.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedFile(file)
                          setIsPreviewOpen(true)
                        }}
                        disabled={!file.content}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{file.content ? "Preview file" : "Preview not available"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadFile(file)}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedFile(file)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No files found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? `No files matching "${searchQuery}"` : "Upload files to get started"}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        )}
      </div>
      
      {/* File Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedFile && getFileIcon(selectedFile.type)}
              <span className="ml-2">{selectedFile?.name}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedFile?.size} • {selectedFile?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4 bg-muted/50 max-h-[400px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {selectedFile?.content}
            </pre>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedFile && downloadFile(selectedFile)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedFile?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteFile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}