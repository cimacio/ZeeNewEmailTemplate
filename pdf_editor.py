"""
PDF Editor

This script provides a web-based interface for editing PDF files.
It allows users to upload a PDF file, update its metadata and
perform other operations like adding, deleting and reordering pages,
and resizing the pdf.
"""

from flask import Flask, request, render_template
import pdfrw

app = Flask(__name__)

@app.route('/')
def index():

    """
    Handle html rendering.
    """

    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():

    """
    Handle file upload and update metadata
    This function handles the file upload, reads the uploaded pdf,
    updates its metadata and performs other operations like adding,
    deleting and reordering pages, and resizing the pdf.
    """

    pdf_file = request.files['pdf_file']
    pdf = pdfrw.PdfReader(pdf_file)

    # Update metadata
    pdf.Info.Author = request.form.get('author')
    pdf.Info.Title = request.form.get('title')
    pdf.Info.Subject = request.form.get('subject')
    pdf.Info.Keywords = request.form.get('keywords')
    pdf.Info.Creator = 'PDF Creator'
    pdf.Info.Producer = 'PDF Producer'
    pdf.Info.CreationDate = '/D'+ pdf.Info.CreationDate[2:]
    pdf.Info.ModDate = '/D'+ pdf.Info.ModDate[2:]
    pdf.Info.Trapped = '/False'

    # Add a new page
    if request.form.get('add_page'):
        new_page = pdfrw.PdfDict()
        new_page.update({
            pdfrw.PdfName.Type: pdfrw.PdfName.Page,
            pdfrw.PdfName.MediaBox: [0, 0, 612, 792],
        })
        pdf.Root.Pages.Kids.append(new_page)

    # Delete a page
    if request.form.get('delete_page'):
        page_num = request.form.get('page_num')
        del pdf.pages[page_num]

    # Reorder pages
    if request.form.get('reorder_pages'):
        page_nums = request.form.getlist('page_nums[]')
        new_pages = [pdf.pages[int(i)] for i in page_nums]
        pdf.pages = new_pages

    # Resize the pdf
    if request.form.get('resize_pdf'):
        scale_factor = request.form.get('scale_factor')
        for page in pdf.pages:
            for key, value in page.items():
                if key == pdfrw.PdfName.MediaBox:
                    value[2] = int(value[2] * scale_factor)
                    value[3] = int(value[3] * scale_factor)
    pdf_file.seek(0)
    pdfrw.PdfWriter().write(pdf_file.filename, pdf)
    return 'PDF updated successfully.'

